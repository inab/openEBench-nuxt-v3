import { defineStore } from 'pinia';
import { decodeDataUrlText } from '~/utils/decodeDataUrlText';

export const useCommunities = defineStore('communities', {
	state: () => ({
		communities: /** @type {any[]} */ ([]),
		projects: /** @type {any[]} */ ([]),
	}),

	getters: {
		getCommunities: (state) => state.communities,
		getProjects: (state) => state.projects,
	},

	actions: {
		async requestCommunitiesData(type) {
			const { $graphql } = useNuxtApp();
			if (!$graphql) {
				throw new Error('$graphql is not available in the current context');
			}

			const returnData = await $graphql('/graphql', {
				method: 'POST',
				headers: {
					Accept: 'text/plain, */*',
				},
				body: JSON.stringify({
					query: `
                                {
                                getCommunities {
                                    _id
                                    name
                                    acronym
                                    description
                                    status
                                    keywords
                                    links {
                                        uri
                                        comment
                                        label
                                    }
                                    benchmarkingEvents {
                                        _id
                                    }
                                    _metadata
                                }
                            }`,
				}),
			});

			const data = returnData.data.getCommunities;
			const dataFormatted = await this.formatData(data ?? []);
			this.communities = this.filterCommunities(dataFormatted);
			this.projects = this.filterProjects(dataFormatted);

			if (type && type === 'projects') {
				return this.projects;
			}

			return this.communities;
		},

		async formatData(data) {
			return Promise.all(
				data.map(async (community) => {
					if (!community.links) {
						community.links = [];
					}

					community.logo = '/opeb_logo.gif';

					community.links.forEach((link) => {
						if (link.label === 'Logo' || link.comment === '@logo') {
							community.logo = link.uri;
						}
					});
					community._metadata =
						typeof community._metadata === 'string'
							? JSON.parse(community._metadata)
							: (community._metadata ?? {});
					if (community._metadata && 'project:summary' in community._metadata) {
						const decodedSummary = await decodeDataUrlText(community._metadata['project:summary']);

						community.summary = decodedSummary;
						community._metadata['project:summary'] = decodedSummary;
					}
					if (community.status === 'abandoned') community.status = 'inactive';
					return community;
				})
			);
		},

		filterCommunities(data) {
			return data.filter((community) =>
				community._metadata ? !community._metadata.project_spaces : true
			);
		},

		filterProjects(data) {
			return data.filter((community) =>
				community._metadata ? community._metadata.project_spaces : false
			);
		},
	},
});
