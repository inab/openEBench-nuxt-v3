import { defineStore } from "pinia";
import parseDataURL from "data-urls";
import { labelToName, decode } from "whatwg-encoding";

export const useCommunities = defineStore("communities", {
  state: () => ({
    communities: [],
    projects: [],
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

      return await $graphql("/graphql", {
        method: "POST",
        headers: {
          Accept: "text/plain, */*",
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
      }).then((returnData) => {
        let data = returnData.data.getCommunities;
        let dataFormatted = this.formatData(data ?? null);
        this.communities = this.filterCommunities(dataFormatted);
        this.projects = this.filterProjects(dataFormatted);

        if (type && type === "projects") {
          return this.projects;
        }

        return this.communities;
      }).catch((error) => {
        console.error('Error:', error);
      });
    },

    formatData(data) {
      return data.map((community) => {
        if(!community.links) { community.links = []; }
        community.links.forEach((link) => {
          if (link.comment === "@logo") {
            community.logo = link.uri;
          }
        });
        community._metadata = JSON.parse(community._metadata);
        if (community._metadata && "project:summary" in community._metadata) {
          const dataURL = parseDataURL(community._metadata["project:summary"]);
          const encodingName = labelToName(
            dataURL.mimeType.parameters.get("charset") || "utf-8",
          );
          const decodedSummary = decode(dataURL.body, encodingName);

          community.summary = decodedSummary;
          community._metadata["project:summary"] = decodedSummary;
        }
        if (community.status === "abandoned") community.status = "inactive";
        return community;
      });
    },

    filterCommunities(data) {
      return data.filter((community) =>
        community._metadata ? !community._metadata.project_spaces : true,
      );
    },

    filterProjects(data) {
      return data.filter((community) =>
        community._metadata ? community._metadata.project_spaces : false,
      );
    },
  },
});
