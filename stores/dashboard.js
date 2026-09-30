import { defineStore } from "pinia";
import { useAsyncData } from 'nuxt/app';
import customApi from "~/composables/useAPI";
import { useNuxtApp, useRuntimeConfig } from "#app";
import parseDataURL from "data-urls";
import { TextDecoder } from "@exodus/bytes/encoding.js";
import useAPI from "~/composables/useAPI";

const BASE_URL = '/api/stats/tools/';

export const useDashboard = defineStore("dashboard", {
  state: () => ({
    resourcesCount: 0,
    toolsCount: 0,
    communitiesCount: 0,
    projectsCount: 0,
  }),

  getters: {
    ResourcesCount: (state) => state.resourcesCount,
    CommunitiesCount: (state) => state.communitiesCount,
    ProjectsCount: (state) => state.projectsCount
  },

  actions: {

    async getResourcesCount() {
      const { $observatory } = useNuxtApp();

      try {
        const response = await $observatory("/api/stats/tools/count_total", {
          method: "GET",
        });
        this.resourcesCount = response[0].data;

        // console.log("Resources Count:", this.resourcesCount);
      } catch (error) {
        console.error("Error fetching resources count:", error);
      }
    },

    async getCommunities() {
      const { $graphql } = useNuxtApp();

      try {
        const { data: communities } = await $graphql("/graphql", {
          method: "POST",
          headers: { Accept: "text/plain, */*" },
          body: JSON.stringify({
            query: `
              {
                getCommunities {
                  _id
                  _metadata
                }
              }
            `,
          }),
        });

        const communitiesData = communities.getCommunities.map(
          (community) => {
            community._metadata = JSON.parse(community._metadata);

            if (community._metadata && "project:summary" in community._metadata) {
              const dataURL = parseDataURL(
                community._metadata["project:summary"]
              );

              if (dataURL) {
                const encodingName =
                  dataURL.mimeType.parameters.get("charset") || "utf-8";
                const decodedSummary = new TextDecoder(encodingName).decode(
                  dataURL.body,
                );
                community.summary = decodedSummary;
                community._metadata["project:summary"] = decodedSummary;
              } else {
                community.summary = null;
              }
            } else {
              community.summary = null;
            }

            return community;
          }
        );

        this.communitiesCount = communitiesData.filter(
          (item) =>
            item._metadata ? !item._metadata.project_spaces : true
        ).length;

        this.projectsCount = communitiesData.filter(
          (item) =>
            item._metadata ? item._metadata.project_spaces : false
        ).length;

        // console.log("Communities Count:", this.communitiesCount);
        // console.log("Projects Count:", this.projectsCount);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    },

    
  }
})