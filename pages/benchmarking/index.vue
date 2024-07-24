<template>
    <div class="benchmarking-communities container">
        <div class="w-100">
            <UAccordion :items="HEADER_ITEM">
                <template #item="{ item }">
                    <p class="italic text-gray-900 dark:text-white text-center">
                        {{ item.description }}
                    </p>
                </template>
                <template #default="{ item, open }">
                    <UButton color="primary" variant="ghost" class="border-b border-gray-200 dark:border-gray-700 community-collapse-btn" :ui="{ rounded: 'rounded-none' }">              
                      <div class="truncate primary">
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
                <template #benchmarking>
                    <div class="benchmarking-communities__header">
                        <div class="row">
                            <div class="col-6">
                                <img src="~/assets/images/illustrations/lab_community.png" alt="welcome-header-image" />
                            </div>
                            <div class="col-6 benchmarking-communities__header__right">
                                <div class="benchmarking-communities__header__right__row">
                                    Unbiased and objective evaluations of bioinformatics resources are challenging to set up and can only be effective when built and implemented around community driven efforts. Thus, in OpenEBench we gather several community initiatives which establish standards and automated services to facilitate scientific benchmarking.
                                </div>
                                <div class="benchmarking-communities__header__right__row">
                                    These efforts provide a way for software developers to implement more efficient methods, tools and web services by comparing their performance on previously agreed datasets and metrics with other similar resources and, more importantly, help end-users that tend to have difficulties in choosing the right tool for the problem at hand, and are not necessarily aware of the latest developments in each of the fields of the bioinformatics methods they need to use.
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UAccordion>
        </div>
        <div class="benchmarking-communities__container">
            <div class="grid grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4" v-if="status === 'pending'">
                <div class="community-card flex flex-col" v-for="(c, i) in Array.from({length: 8}, (x, i) => i)"
                    :key="i">
                    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
                    <div class="space-y-2">
                        <USkeleton class="h-4 w-[250px]" />
                        <USkeleton class="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-cols-max">
                <div class="community-card h-100" v-for="(community, index) in communities" :key="index">
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
import { ref } from 'vue'
import CommunityCard from '@/components/Cards/CommunityCard/CommunityCard.vue'

import { useCommunities } from '@/stores/communities'

const communitiesStore = useCommunities()

const HEADER_ITEM = [{
    label: "Benchmarking Communities",
    defaultOpen: true,
    slot: 'benchmarking'
}]

const { data: communities, status} = await useAsyncData(() => communitiesStore.requestCommunitiesData())
</script>
<style scoped lang="scss">
.benchmarking-communities {
    font-size: 16px;
    &__header {
        &__right {
            display: flex;
            flex-direction: column;
            &__row {
                padding-top: 60px;
                padding-bottom: 30px;
                &:last-child {
                    padding-top: 0;
                    padding-bottom: 0;
                    flex: 1;
                }
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