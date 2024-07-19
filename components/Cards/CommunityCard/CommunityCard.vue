<template>
    <div class="community-card__item max-w-sm rounded overflow-hidden shadow-lg">
        <div class="community-card__item__image">
            <NuxtLink :to="to">
                <div class="community-card__item__image__box"
                :style="{ backgroundImage: 'url(' + logo + ')' }">
                </div>
            </NuxtLink>
        </div>
        <div class="community-card__item__acronym font-bold text-xl">
            {{ acronym }}
        </div>
        <div class="community-card__item__body">
            <div class="px-6 py-4">
                <p class="text-gray-700 text-base">
                    {{ name }}
                </p>
            </div>
            <div class="px-6 pt-4 pb-2">
                <div v-if="benchmarkingEvents && benchmarkingEvents.length > 0"
                    class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    <font-awesome-icon :icon="['far', 'calendar-check']" />
                    {{ benchmarkingEvents.length }}
                    {{ pluralize('Events', benchmarkingEvents.length) }}
                </div>
                <div class="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    <div class="text-xs font-normal leading-none max-w-full flex-initial">{{ status }}</div>
                </div>
                <div v-if="referenceTools.length > 0"
                    class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    <font-awesome-icon :icon="['fas', 'gear']" />
                    {{ benchmarkingEvents.length }}
                    {{ pluralize('Events', benchmarkingEvents.length) }}
                </div>
            </div>
            <div class="community-card__item__footer">
                <button class="bg-white hover:bg-blue-700 text-white font-bold">
                    <NuxtLink :to="to">
                        Current Event
                    </NuxtLink>
                </button>
                <UDropdown :items="itemsCommunityLinks" :popper="{ arrow: true }"
                    :ui="{ item: { disabled: 'cursor-text select-text' } }"
                    class="community-card__item__dropdown">
                    <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
                    
                    <!-- <template #item="{ item }">
                        <a :href="item.uri" target="_blank">
                            <span class="">{{ item.label }}</span>
                            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                        </a> 
                    </template> -->
                </UDropdown>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import pluralize from 'pluralize';

const props = defineProps<{
    _id: String,
    acronym:String,
    name: String,
    logo: String,
    links: any[] | undefined,
    status: String,
    benchmarkingEvents: Array<any>,
    referenceTools: Array<any>,
    summary: String,
    to: String
}>();


let itemsCommunityLinks: null = null
if(props.links) {
    itemsCommunityLinks = props.links.filter((item: any) => {
        if(item.comment == '@logo') { return; }
        return [
            {
                label: item.label,
                href: item.uri,
                icon: 'i-heroicons-link',
                target: '_blank'
            }
        ]
    })
}

</script>

<style scoped lang="scss">
    .community-card__item {
        transition: transform 0.2s;
        display: flex;
        flex-direction: column;
        justify-content: start;
        height: 100%;
        cursor: pointer;
        &:hover {
            transform: scale(1.05);
        }
        &__image {
            padding: 20px 20px 0 20px;
            height: 140px;
            a {
                display: block;
                height: 120px;
            }
            &__box {
                height: 120px;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;;
            }
        }
        &__acronym {
            text-align: center;
            padding: 10px 0;
            background-color: #b0d9ff;
        }
        &__body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            &__body {
                padding: 0 20px;
            }
        }
        &__footer {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            button {
                padding: 0px;
            }
            a {
                text-decoration: none;
            }
        }
        &__dropdown {
            a {
                text-decoration: none;
            }
        }
    }
</style>