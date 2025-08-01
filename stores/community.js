import { defineStore } from "pinia";
import parseDataURL from "data-urls";
import { labelToName, decode } from "whatwg-encoding";

// OpenEBench API
export const useCommunity = defineStore("community", {
  state: () => ({
    communityId: null,
    communityData: {},
    currentEvent: Object,
    communityReferences: null,
    events: [],
    datasets: [],
    tools: [],
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
      const responseData = await useNuxtApp().$graphql("/graphql", {
        method: "POST",
        headers: {
          Accept: "text/plain, */*",
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
                                        datalinks {
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

      this.communityId = id;

      // Community
      this.communityData = this.formatCommunityData(
        responseData.data.getCommunities[0],
      );

      // Events
      this.setEvents(responseData.data.getBenchmarkingEvents);

      let defaultEvent = this.events[0] ?? null;
      if (event) {
        defaultEvent = responseData.data.getBenchmarkingEvents.filter(
          (e) => e._id == event,
        )[0];
      }
      this.setCurrentEvent(defaultEvent);

      // Datasets
      this.setDatasets(responseData.data.getDatasets);

      // Tools
      this.setTools(responseData.data.getTools);

      // Community References
      this.setCommunityReferences(
        responseData.data.getCommunities[0].references,
      );

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
              href: "https://doi.org/" + reference.split(":")[1],
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
    formatCommunityData(data) {
      data.links.forEach((link) => {
        if (link.comment === "@logo") {
          data.logo = link.uri;
        }
      });

      data._metadata = JSON.parse(data._metadata);
      if (data._metadata && "project:summary" in data._metadata) {
        const dataURL = parseDataURL(data._metadata["project:summary"]);

        const encodingName = labelToName(
          dataURL.mimeType.parameters.get("charset") || "utf-8",
        );
        const decodedSummary = decode(dataURL.body, encodingName);
        data.summary = decodedSummary;
        data._metadata["project:summary"] = decodedSummary;
      } else {
        data.summary = null;
      }

      if (data.status === "abandoned") data.status = "inactive";
      return data;
    },
  },
});
