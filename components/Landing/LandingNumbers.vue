<template>
  <div class="langing-numbers">
    <div class="container h-100">
      <div class="row h-100 align-items-center">
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Communities" :number="communitiesCount" />
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Tools" :number="toolsCount" />
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Resources" :number="resourcesCount" />
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0 h-100">
          <AnimateNumber description="Project Spaces" :number="projectsCount" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import parseDataURL from "data-urls";
import { labelToName, decode } from "whatwg-encoding";
import { useRuntimeConfig, useNuxtApp, useAsyncData } from '#app';
import customApi from "~/composables/useAPI";
import AnimateNumber from "~/components/Landing/AnimateNumber.vue";

interface RuntimeConfigMonitoring {
  public: {
    MONITORING: {
      baseURL: string;
    };
  };
}

const runtimeConfig = useRuntimeConfig() as unknown as RuntimeConfigMonitoring;
const URL_AGGREAGATE = runtimeConfig.public.MONITORING.baseURL + "aggregate";

const communitiesCount: Ref<any> = ref(null);
const resourcesCount: Ref<any> = ref(null);
const projectsCount: Ref<any> = ref(null);
const toolsCount = ref(0);

const { $api } = useNuxtApp();
const { $graphql } = useNuxtApp();
const { $observatory } = useNuxtApp();

onMounted(async () => {
  await getCommunities();
  await getToolsCount();
  await getResourcesCount();
});

async function getCommunities() {
  const { data: communities, pending }: { data: any; pending: Ref<boolean> } =
    await useAsyncData("communities", () =>
      $graphql("/graphql", {
        method: "POST",
        headers: {
          Accept: "text/plain, */*",
        },
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
      }),
    );

  const communitiesData = (communities.value as any).data.getCommunities.map(
    (community: Record<string, any>) => {
      community._metadata = JSON.parse(community._metadata);

      if (community._metadata && "project:summary" in community._metadata) {
        const dataURL = parseDataURL(community._metadata["project:summary"]);

        // Check if dataURL is not null before proceeding
        if (dataURL) {
          const encodingName =
            labelToName(
              dataURL.mimeType.parameters.get("charset") || "utf-8",
            ) || "utf-8"; // Provide a fallback if encodingName is null

          const decodedSummary = decode(dataURL.body, encodingName);
          community.summary = decodedSummary;
          community._metadata["project:summary"] = decodedSummary;
        } else {
          community.summary = null;
        }
      } else {
        community.summary = null;
      }
      return community;
    },
  );

  communitiesCount.value = communitiesData.filter(
    (item: Record<string, any>) =>
      item._metadata ? !item._metadata.project_spaces : true,
  ).length;

  projectsCount.value = communitiesData.filter((item: Record<string, any>) =>
    item._metadata ? item._metadata.project_spaces : false,
  ).length;
}

async function getToolsCount() {
  const { customApi: tools } = await customApi(URL_AGGREAGATE, {
    method: "HEAD",
    ...{ params: { limit: 1 } },
  });

  const toolsHeader: RegExpMatchArray = (tools.headers
    .get("content-range")
    ?.match(/(\d+)-(\d+|\*)\/(\d+|\*)/) || []) as RegExpMatchArray;
  toolsCount.value = parseInt(toolsHeader[3]);
}

async function getResourcesCount() {
  const { data: resources, pending }: { data: any; pending: Ref<boolean> } =
    await useAsyncData("resources", () =>
      $observatory("/api/stats/tools/count_total", {
        method: "GET",
      }),
    );

  resourcesCount.value = resources.value[0].data;
}
</script>

<style scoped lang="scss">
.langing-numbers {
  min-height: 170px;
  color: white;
  background-image: url("~/assets/images/backgrounds/material2_parallax.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /* Parallax effect */
  display: flex;
  align-items: center;

  .container {
    height: 100%;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .col {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }
}
</style>
