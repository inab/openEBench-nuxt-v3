<template>
  <div class="projects">
    <BreadcrumbsBar />
    <div class="w-100 container">
      <UAccordion :items="HEADER_ITEM">
        <template #default="{ item, open }">
          <UButton
            color="primary"
            variant="ghost"
            class="border-b border-gray-200 dark:border-gray-700 community-collapse-btn"
            :ui="{ rounded: 'rounded-none' }"
          >
            <div class="primary">
              <h2>{{ item.label }}</h2>
            </div>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
          </UButton>
        </template>
        <template #projects>
          <div class="projects__header">
            <div class="row">
              <div class="col-lg-6 d-none d-lg-block">
                <img
                  src="~/assets/images/illustrations/lab_community.png"
                  alt="welcome-header-image"
                  class="img-fluid"
                />
              </div>
              <div class="col-12 col-lg-6 projects__header__right">
                <div class="projects__header__right__row">
                  Project spaces enable research communities to collaborate on
                  software in life sciences. They offer extendable spaces to
                  collaboratively improve methods, tools, and web services by
                  comparing their performance on previously agreed datasets and
                  metrics with other similar resources.
                </div>
              </div>
            </div>
          </div>
        </template>
      </UAccordion>
    </div>
    <div class="projects__container container">
      <div
        v-if="status.pending"
        class="row g-4"
      >
        <div
          v-for="(c, i) in Array.from({ length: 8 }, (x, i) => i)"
          :key="i"
          class="col-sm-6 col-md-4 col-lg-3"
        >
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-100" />
            <USkeleton class="h-4 w-75" />
          </div>
        </div>
      </div>
      <div v-else class="row g-4">
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="col-sm-6 col-md-4 col-lg-3"
        >
          <CommunityCard
            :id="project._id"
            :acronym="project.acronym"
            :name="project.name"
            :logo="project.logo"
            :links="project.links ? project.links : []"
            :status="project.status"
            :summary="project.summary"
            :benchmarking-events="[]"
            :reference-tools="[]"
            :to="'/projects/' + project._id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommunityCard from "@/components/Cards/CommunityCard/CommunityCard.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useCommunities } from "@/stores/communities";

const communitiesStore = useCommunities();
const projects: Ref<any> = ref(null);
const status = ref({ pending: false });

const HEADER_ITEM = [
  {
    label: "Project Spaces",
    defaultOpen: true,
    slot: "projects",
  },
];

if (
  communitiesStore.getProjects &&
  Object.keys(communitiesStore.getProjects).length > 0
) {
  projects.value = communitiesStore.getProjects;
  status.value = { pending: false };
} else {
  const { data, status } = await useAsyncData(() =>
    communitiesStore.requestCommunitiesData("projects"),
  );
  projects.value = data.value ?? null;
  status.value = status;
}
</script>

<style scoped lang="scss">
.projects {
  font-size: 16px;
  &__header {
    &__right {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      &__row {
        padding-top: 60px;
        padding-bottom: 30px;
      }
    }
  }
  .community-collapse-btn {
    padding: 0;
    &:hover {
      background-color: rgba(248 250 252);
    }
  }
  &__container {
    padding-top: 40px;
  }
}
</style>
