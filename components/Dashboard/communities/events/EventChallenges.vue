<template>
    <div class="community-event-challenges">
        <div class="w-100 flex justify-content-end gap-3 py-3" v-if="commmunityPrivileges.create">
            <NuxtLink 
                :to="`/dashboard/communities/${communityId}/events/add`"
                class="btn custom-btn btn-primary"
                title="Create New Event">
                Create New Challenge
            </NuxtLink>
        </div>
        <UTable
            :columns="columns"
            :loading="isLoadingChallenges"
            :rows="challengesData"
            :ui="{
                tr: {
                    base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
                },
                th: {
                    base: 'text-left rtl:text-right',
                    padding: 'px-2.5 py-2.5',
                    color: 'text-gray-900 dark:text-white',
                    font: 'font-semibold',
                    size: 'text-sm',
                },
                td: {
                    base: '',
                    padding: 'px-3 py-3',
                    font: '',
                    size: 'text-sm',
                },
            }">
            <template #dates-data="{ row }">
                <div>
                    <div class="w-100">Benchmark start: {{ row.dates.benchmark_start }}</div>
                </div>
            </template>
            <template #actions-data="{ row }">
                <div v-if="row.privileges === 'Owner' && row.actions.community">
                    <button title="Edit community" class="btn-event text-neutral-300">
                        <NuxtLink :to="getCommunityChallengeEditLink(row)">
                            <font-awesome-icon :icon="['fas', 'pencil']" />
                        </NuxtLink>
                    </button>
                    <template v-if="row.actions.community.delete">
                        <button title="Delete community" class="btn-event text-neutral-300">
                            <font-awesome-icon :icon="['fas', 'trash']" />
                        </button>
                    </template>
                </div>
                <div v-else-if="row.privileges=== 'Manager' && row.actions.community">
                    <button title="Edit challenge" class="btn-event text-neutral-300">
                        <NuxtLink :to="getCommunityChallengeEditLink(row)">
                            <font-awesome-icon :icon="['fas', 'pencil']" />
                        </NuxtLink>
                    </button>
                    <template v-if="row.actions.community.delete">
                        <button title="Delete challenge" class="btn-event text-neutral-300">
                            <font-awesome-icon :icon="['fas', 'trash']" />
                        </button>
                    </template>
                </div>
                <div v-else-if="row.privileges=== 'anyone' && row.actions.community">
                    <button title="Edit challenge" class="btn-event text-neutral-300">
                        <NuxtLink :to="getCommunityChallengeEditLink(row)">
                            <font-awesome-icon :icon="['fas', 'pencil']" />
                        </NuxtLink>
                    </button>
                </div>
            </template>
            <template #view-data="{ row }">
                <button class="btn-custom-badget text-sm">
                    <NuxtLink :to="`/benchmarking/${row.community_id}?event=${row._id}`" 
                        title="View community events" 
                        class="text-sm">
                        Live
                    </NuxtLink>
                </button>
            </template>
        </UTable>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue";
    import { CommunityPrivilegeActions } from '@/constants/privileges';
    import { Challenge } from "@/types/challenge";

    const props = defineProps<{
        challenges?: Array<Challenge>;
        isLoadingChallenges: boolean;
        commmunityPrivileges: CommunityPrivilegeActions,
        eventId: string,
        communityId: string,
    }>();

    const columns = [
        { 
            label: 'Name',
            key: 'name'
        },
        {
            label: 'Dates',
            key: 'dates',
        },
        {
            label: 'Contacts',
            key: 'challenge_contact',
        },
        {
            label: 'VIEW',
            key: 'view'
        },
        {
            key: 'actions',
            label: 'ACTIONS'
        }
    ];

    const challengesData = computed(() => {
        if(!props.challenges) return [];
        return props.challenges.map(challenge => {
            return {
                ...challenge,
            };
        });
    });

    const challengePrivileges = computed(() => {
        return props.commmunityPrivileges.challenge;
    });

    const getCommunityChallengeEditLink = (row) => {
        return `/dashboard/communities/${props.communityId}/events/${props.eventId}/challenges/${row._id}`;
    }
</script>

<style scoped lang="scss">
.btn-event {
    padding: 5px;
    font-size: 16px;
    a {
        color: theme('colors.gray.400');
    }
}
</style>