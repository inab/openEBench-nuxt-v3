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
            <div class="grid grid-cols-4 gap-4" v-if="pending">
                <div class="" v-for="(c, i) in Array.from({length: 8}, (x, i) => i)"
                    :key="i">
                    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
                    <div class="space-y-2">
                        <USkeleton class="h-4 w-[250px]" />
                        <USkeleton class="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-4 gap-4" v-else>
                <div class="community-card" v-for="(community, index) in communities"
                    :key="index">
                    <CommunityCard
                        :community="community"
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
import parseDataURL from 'data-urls'
import { labelToName, decode } from 'whatwg-encoding'

const { $graphql } = useNuxtApp()
const communities: Ref<any> = ref(null);
 const HEADER_ITEM = [{
    label: "Benchmarking Communities",
    defaultOpen: true,
    slot: 'benchmarking'
 }]

const { data, pending }: { data: any, pending: boolean } = await useAsyncData('communities', () => $graphql('/graphql',
{
    method: 'POST',
    headers: {
        "Accept": "text/plain, */*",
    },
    body: JSON.stringify(
        {
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
            }
        `,
        }
    )
}
))
communities.value = filterCommunities(formatData(data.value.data.getCommunities ?? null));

function formatData(communities: any) {
    return communities.map((community: any) => {
        community.links.forEach((link: { comment: string; uri: any; }) => {
            if (link.comment === '@logo') {
                community.logo = link.uri;
            }
        });
        community._metadata = JSON.parse(community._metadata);
        if (community._metadata && 'project:summary' in community._metadata) {
            const dataURL = parseDataURL(community._metadata['project:summary']);
            const encodingName = labelToName(
                dataURL.mimeType.parameters.get('charset') || 'utf-8'
            );
            const decodedSummary = decode(dataURL.body, encodingName);

            community.summary = decodedSummary;
            community._metadata['project:summary'] = decodedSummary;
        }
        if (community.status === 'abandoned') community.status = 'inactive';
        return community;
    })
}

function filterCommunities(communities: any) {
    return communities.filter((community: any) => community._metadata ? !community._metadata.project_spaces : true);
}
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