<template>
  <div class="projects">
    <BreadcrumbsBar />
    <div class="w-100 container">
      <UAccordion class="intro-accordion" :items="HEADER_ITEM" default-value="projects">
        <template #default="{ item }">
          <h2 class="intro-accordion-title">{{ item.label }}</h2>
        </template>

        <template #trailing="{ open }">
          <UIcon name="i-heroicons-chevron-right-20-solid"
            class="intro-accordion-icon"
            :class="[open && 'rotate-90']" />
        </template>

        <template #projects>
          <div class="projects__header">
            <div class="row">
              <div class="col-md-6 d-none d-lg-block projects__header__left">
                <img src="~/assets/images/illustrations/lab_community.png" alt="welcome-header-image"
                  class="img-fluid" />
              </div>

              <div class="col-md-6 projects__header__right">
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
      <div v-if="status === 'pending'" class="row g-4 loading-skeleton">
        <div
          v-for="(_, index) in 8"
          :key="index"
          class="col-sm-6 col-md-4 col-lg-3 card-community-skeleton"
        >
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-100" />
            <USkeleton class="h-4 w-75" />
          </div>
        </div>
      </div>
      <p v-else-if="status === 'error'" class="text-red-600" role="alert">
        Project spaces could not be loaded. Please try again later.
      </p>
      <div v-else-if="projects?.length" class="row g-4">
        <div
          v-for="project in projects"
          :key="project._id"
          class="col-sm-6 col-md-4 col-lg-3 community-card-item"
        >
          <CommunityCard
            :_id="project._id"
            :acronym="project.acronym"
            :name="project.name"
            :logo="project.logo"
            :links="project.links"
            :status="project.status"
            :summary="project.summary"
            :benchmarking-events="[]"
            :reference-tools="[]"
            :to="`/projects/${project._id}`"
          />
        </div>
      </div>
      <p v-else class="text-gray-500">No project spaces are available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommunityCard from "@/components/Cards/CommunityCard/CommunityCard.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useCommunities } from "~~/stores/communities";

const communitiesStore = useCommunities();


const HEADER_ITEM = [
  {
    label: "Project Spaces",
    value: "projects",
    slot: "projects",
  },
];

const { data: projects, status } = useAsyncData(
  "projects",
  async () => {
    if (
      communitiesStore.getProjects &&
      Object.keys(communitiesStore.getProjects).length > 0
    ) {
      return communitiesStore.getProjects;
    }

    return communitiesStore.requestCommunitiesData("projects");
  },
);
</script>

<style scoped lang="scss">
.projects {
  font-size: 16px;

  &__header {
    &__right {
      display: flex;
      align-items: center;

      &__row {
        padding-top: 50px;
        padding-bottom: 30px;

        &:last-child {
          padding-top: 0;
          padding-bottom: 0;
          flex: 1;
        }
      }
    }

    .projects__header__right__row {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: #6b7280;
    }

    &__left {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin: auto;
        width: 90%;
      }
    }
  }

  &__container {
    padding-top: 40px;
  }

}
</style>
