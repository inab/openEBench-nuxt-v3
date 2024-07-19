<template>
    <div class="projects container">
        <div class="w-100">
            <UAccordion :items="HEADER_ITEM">
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
                <template #projects>
                    <div class="projects__header">
                        <div class="row">
                            <div class="col-6">
                                <img src="~/assets/images/illustrations/lab_community.png" alt="welcome-header-image" />
                            </div>
                            <div class="col-6 projects__header__right">
                                <div class="projects__header__right__row">
                                    Project spaces enable research communities to collaborate on software in life sciences. They offer extendable spaces to collaboratively improve methods, tools and web services by comparing their performance on previously agreed datasets and metrics with other similar resources.
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UAccordion>
        </div>
        <div class="projects__container">
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
                <div class="community-card" v-for="(project, index) in projects"
                    :key="index">
                    <CommunityCard
                        :id="project._id"
                        :acronym="project.acronym"
						:name="project.name"
						:logo="project.logo"
						:links="project.links?project.links:[]"
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
import parseDataURL from 'data-urls'
import { labelToName, decode } from 'whatwg-encoding'
import CommunityCard from '@/components/Cards/CommunityCard/CommunityCard.vue'
import { ref } from 'vue';

const { $graphql } = useNuxtApp()
const projects: Ref<any> = ref(null)

const HEADER_ITEM = [{
    label: "Project Spaces",
    defaultOpen: true,
    slot: 'projects'
}]

onMounted(async () => {
    await getCommunities()
})

async function getCommunities() {
    const { data: communities, pending }: { data: any, pending: boolean } = await useAsyncData('communities', () => $graphql('/graphql',
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
    }));

    projects.value = filterCommunities(formatData(communities.value.data.getCommunities ?? null));
}

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
    return communities.filter((community: any) => community._metadata ? community._metadata.project_spaces : false);
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