import { defineStore } from 'pinia';
import { decodeDataUrlText } from '~/utils/decodeDataUrlText';

// OpenEBench API
export const useCommunity = defineStore('community', {
	state: () => ({
		communityId: null,
		communityData: /** @type {any} */ ({}),
		currentEvent: /** @type {any} */ ({}),
		communityReferences: null,
		events: /** @type {any[]} */ ([]),
		datasets: /** @type {any[]} */ ([]),
		tools: /** @type {any[]} */ ([]),
		pending: true,
	}),

	getters: {
		getCommunityData: (state) => state.communityData,

		getCurrentEvent: (state) => state.currentEvent,

		getCommunityReferences: (state) => state.communityReferences,

		getEvents: (state) => state.events,

		getDatasets: (state) => state.datasets,

		getTools: (state) => state.tools,
	},

	actions: {
		async requestCommunityData(id, event) {
			// TEMPORARY: the Dataset field is `datalinks` in the new schema (test2) and `datalink` in the old
			// one (production). TODO: remove the fallback once the new schema is stable everywhere.
			const fetchCommunity = (datalinkField) =>
				useNuxtApp().$graphql('/graphql', {
					method: 'POST',
					headers: {
						Accept: 'text/plain, */*',
					},
					body: JSON.stringify({
						query: `
                                query ($community_id: String!) {
                                    getCommunities(communityFilters: {id: $community_id}) {
                                    _id
                                    name
                                    acronym
                                    description
                                    status
                                    keywords
                                    references
                                    community_contact_ids
                                    links {
                                        uri
                                        comment
                                        label
                                    }
                                    _metadata
                                    __typename
                                    }
                                    getBenchmarkingEvents(benchmarkingEventFilters: {community_id: $community_id}) {
                                        _id
                                        dates {
                                            creation
                                            __typename
                                        }
                                        name
                                        url
                                        challenges {
                                            _id
                                            name
                                            acronym
                                            url
                                            __typename
                                        }
                                        __typename
                                    }
                                    getDatasets(datasetFilters: {community_id: $community_id, visibility: "public"}) {
                                        name
                                        type
                                        ${datalinkField} {
                                            uri
                                            __typename
                                        }
                                        __typename
                                    }
                                    getTools(toolFilters: {community_id: $community_id}) {
                                        _id
                                        name
                                        status
                                        description
                                        registry_tool_id
                                        __typename
                                    }
                                }
                            `,
						variables: {
							community_id: id,
						},
					}),
				});

			let responseData = await fetchCommunity('datalinks');
			// TODO: remove this retry together with the one in api/challengeAPI.js
			if (responseData?.errors?.some((e) => /datalinks/.test(e.message ?? ''))) {
				responseData = await fetchCommunity('datalink');
			}

			this.communityId = id;

			// Community
			const community = responseData?.data?.getCommunities?.[0] ?? null;
			if (!community) {
				this.communityData = null;
				this.setEvents([]);
				this.setCurrentEvent(null);
				this.setDatasets([]);
				this.setTools([]);
				this.setCommunityReferences([]);
				return null;
			}

			this.communityData = await this.formatCommunityData(community);

			// Events
			this.setEvents(responseData?.data?.getBenchmarkingEvents ?? []);

			let defaultEvent = this.events[0] ?? null;
			if (event) {
				defaultEvent = (responseData?.data?.getBenchmarkingEvents ?? []).filter(
					(e) => e._id == event
				)[0];
			}
			this.setCurrentEvent(defaultEvent);

			// Datasets
			this.setDatasets(responseData?.data?.getDatasets ?? []);

			// Tools
			this.setTools(responseData?.data?.getTools ?? []);

			// Community References
			this.setCommunityReferences(community.references);

			return this.communityData;
		},

		// Setting events
		setEvents(eventsData) {
			this.events = eventsData.sort((a, b) => {
				if (a._id < b._id) {
					return 1;
				}
				if (a._id > b._id) {
					return -1;
				}
				return 0;
			});
		},

		// Setting datasets
		setDatasets(datasetsData) {
			this.datasets = datasetsData;
		},

		// Setting tools
		setTools(toolsData) {
			this.tools = toolsData;
		},

		// Setting community references
		setCommunityReferences(references) {
			this.communityReferences = references
				? references.map((reference) => {
						return {
							href: 'https://doi.org/' + reference.split(':')[1],
							doi: reference,
						};
					})
				: [];
		},

		setCurrentEvent(event) {
			if (!event && this.getEvents.length > 0) {
				this.currentEvent = this.getEvents[0];
			} else {
				this.currentEvent = event;
			}
		},

		// Format community data
		async formatCommunityData(data) {
			data.links = data.links ?? [];
			data.links.forEach((link) => {
				if (link.comment === '@logo') {
					data.logo = link.uri;
				}
			});

			data._metadata =
				typeof data._metadata === 'string' ? JSON.parse(data._metadata) : (data._metadata ?? {});
			if (data._metadata && 'project:summary' in data._metadata) {
				const decodedSummary = await decodeDataUrlText(data._metadata['project:summary']);
				data.summary = decodedSummary;
				data._metadata['project:summary'] = decodedSummary;
			} else {
				data.summary = null;
			}

			if (data.status === 'abandoned') data.status = 'inactive';
			return data;
		},
	},
});
