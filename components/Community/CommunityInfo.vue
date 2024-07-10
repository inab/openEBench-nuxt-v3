<template>
    <div class="community-info">
        <div class="community-info__header">
            <UAccordion :items="HEADER_ITEM"
                :ui="{ tab: { active: 'cursor-text select-text' } }">
                <template #item="{ item }">
                    <p class="italic text-gray-900 dark:text-white text-center">
                        {{ item.label }}
                    </p>
                    <p class="">
                        {{ item.description }}
                    </p>
                </template>
                <template #default="{ item, open }">
                    <UButton color="primary" variant="ghost" 
                        class="border-b border-gray-200 dark:border-gray-700 community-info__header__collapse__btn" 
                        :ui="{ rounded: 'rounded-none' }">              
                        <div class="truncate primary">
                          <div class="text-left">{{ item.label }}</div>
                          <div class="text-left">{{ community.name }}</div>
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
                <template #acronym>
                    <div class="benchmarking-communities__header">
                        <div class="row">
                            <div class="col-4">
                                <img :src=community.logo alt="welcome-header-image" />
                            </div>
                            <div class="col-8 benchmarking-communities__header__right">
                                <div class="benchmarking-communities__header__right__row">
                                    {{ community.description}}
                                </div>
                                <div v-if="community.keywords" class="benchmarking-communities__header__right__row">
                                    <span class="font-semibold">Keywords:</span>
                                    <span>{{ community.keywords.join(', ') }}</span>
                                </div>
                                <div v-if="communityReferences && communityReferences.length>0">
                                    <div class="benchmarking-communities__header__right__row d-flex">
                                        <span class="font-semibold">References:</span>
                                        <div v-for="(reference, index) in communityReferences" :key="index">
                                            <a :href="reference.href" target="_blank">{{ reference.doi }}</a>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="communityLinks && communityLinks.length>0">
                                    <div class="benchmarking-communities__header__right__row d-flex">
                                        <span class="font-semibold">Links:</span>
                                        <div v-for="(link, index) in communityLinks" :key="index">
                                            <a :href="link.uri" target="_blank">{{ link.label }}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UAccordion>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    community: any;
    communityReferences: any[];
}>();

const HEADER_ITEM = [{
    label: props.community.acronym?props.community.acronym:'',
    description: props.community.description,
    defaultOpen: true,
    slot: 'acronym'
}]

let communityLogo = computed(() => {
    return props.community.links.forEach((link: { comment: string; uri: any; }) => {
        if (link.comment === '@logo') {
            return link.uri;
        }
    });
})

let communityLinks = computed(() => {
    if(!props.community.links) return [];
    return props.community.links.filter((link: { comment: string; }) => {
        if (link.comment !== '@logo') {
            return link;
        }
    });
})


const expand = ref(false);
</script>

<style scoped lang="scss">
.community-info {
    padding-bottom: 40px;
    .community-info__header {
        &__collapse__btn {
            padding: 0;
            &:hover {
                background-color: rgba(248 250 252);
            }
        
        }
    }
}
</style>