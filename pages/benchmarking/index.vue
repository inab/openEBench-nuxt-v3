<template>
  <div class="benchmarking-communities">
    <BreadcrumbsBar />
    <div class="w-100 container">
      <UAccordion :items="HEADER_ITEM">
        <template #item="{ item }">
          <p class="italic text-gray-900 dark:text-white text-center">
            {{ item.description }}
          </p>
        </template>
        <template #default="{ item, open }">
          <UButton
            color="primary"
            variant="ghost"
            class="border-b border-slate-200 dark:border-gray-700 community-collapse-btn"
            :ui="{ rounded: 'rounded-none' }"
          >
            <div class="primary label-btn">
              <h2>{{ item.label }}</h2>
            </div>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
          </UButton>
        </template>
        <template #benchmarking>
          <div class="benchmarking-communities__header">
            <div class="row">
              <div
                class="col-md-6 d-none d-lg-block benchmarking-communities__header__left"
              >
                <img
                  src="~/assets/images/illustrations/lab_community.png"
                  alt="welcome-header-image"
                />
              </div>
              <div class="col-md-6 benchmarking-communities__header__right">
                <div class="benchmarking-communities__header__right__row">
                  Unbiased and objective evaluations of bioinformatics resources
                  are challenging to set up and can only be effective when built
                  and implemented around community driven efforts. Thus, in
                  OpenEBench we gather several community initiatives which
                  establish standards and automated services to facilitate
                  scientific benchmarking.
                </div>
                <div class="benchmarking-communities__header__right__row">
                  These efforts provide a way for software developers to
                  implement more efficient methods, tools and web services by
                  comparing their performance on previously agreed datasets and
                  metrics with other similar resources and, more importantly,
                  help end-users that tend to have difficulties in choosing the
                  right tool for the problem at hand, and are not necessarily
                  aware of the latest developments in each of the fields of the
                  bioinformatics methods they need to use.
                </div>
              </div>
            </div>
          </div>
        </template>
      </UAccordion>
    </div>
    <div class="benchmarking-communities__container container">
      <div v-if="statusRef === 'pending'" class="row g-4 loading-skeleton">
        <div
          v-for="(c, i) in Array.from({ length: 8 }, (x, i) => i)"
          :key="i"
          class="col-sm-6 col-md-4 col-lg-3 card-community-skeleton"
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
          v-for="(community, index) in communities"
          :key="index"
          class="col-sm-6 col-md-4 col-lg-3 community-card-item"
        >
          <CommunityCard
            :_id="community._id"
            :acronym="community.acronym"
            :name="community.name"
            :logo="community.logo"
            :links="community.links"
            :status="community.status"
            :benchmarking-events="community.benchmarkingEvents"
            :summary="community.summary"
            :reference-tools="[]"
            :to="'/benchmarking/' + community._id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CommunityCard from "@/components/Cards/CommunityCard/CommunityCard.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import { useCommunities } from "@/stores/communities";

const communitiesStore = useCommunities();
const communities: Ref<any> = ref(null);
const statusRef = ref("pending");

const HEADER_ITEM = [
  {
    label: "Benchmarking Communities",
    defaultOpen: true,
    slot: "benchmarking",
  },
];

const fetchCommunitiesData = async () => {
  try {
    if (
      communitiesStore.getCommunities &&
      Object.keys(communitiesStore.getCommunities).length > 0
    ) {
      communities.value = communitiesStore.getCommunities;
      statusRef.value = "success";
    } else {
      const data = await communitiesStore.requestCommunitiesData();
      communities.value = data || communitiesStore.getCommunities;

      statusRef.value = "success";
    }
  } catch (error) {
    statusRef.value = "error";
  }
};

onMounted(fetchCommunitiesData);

</script>
<style scoped lang="scss">
.benchmarking-communities {
  font-size: 16px;
  &__header {
    &__right {
      display: flex;
      flex-direction: column;
      &__row {
        padding-top: 30px;
        padding-bottom: 30px;
        &:last-child {
          padding-top: 0;
          padding-bottom: 0;
          flex: 1;
        }
      }
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
  .community-collapse-btn {
    padding: 0;
    display: flex;
    justify-content: space-between;
    &:hover {
      background-color: white;
    }
    span {
      font-size: 30px;
    }
  }
  &__container {
    padding-top: 40px;
  }
  .label-btn {
    white-space: nowrap;
  }
}
</style>
