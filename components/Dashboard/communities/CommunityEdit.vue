<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2 class="text-primaryOeb-500">Edit Community : <i>{{ communityObj.acronym }}</i></h2>
            </div>
            <div class="" v-if="loadingData">
                <div class="space-y-2">
                    <USkeleton class="dashboard-community-edit__skeleton__small" />
                    <USkeleton class="dashboard-community-edit__skeleton__big" />
                </div>
            </div>
            <div class="dashboard-community-edit__content" v-else>
                <div class="">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunity">
                        <div class="row">
                            <div class="col-8">
                                <div class="form-group">
                                    <label for="acronym">Acronym</label>
                                    is view{{ isView }}
                                    <input type="text" class="form-control" id="acronym" v-model="communityData.acronym"
                                        :disabled="!commmunityPrivileges.update || isView" />
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="status">Status</label>
                                    {{  selectedStatus }}
                                    <USelectMenu  
                                        v-model="selectedStatus" 
                                        :options="CommunityStatusLabels"
                                        :disabled="!commmunityPrivileges.update || isView" 
                                        :color="commmunityPrivileges.update?'white':'gray'">
                                        <template #label>
                                            <span :class="[CommunityStatusColors[selectedStatus.toLowerCase()], 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true" />
                                            <span class="truncate">{{ selectedStatus }}</span>
                                        </template>
                                        <template #option="{ option: item }">
                                            <span
                                                class="h-2 w-2 rounded-full" 
                                                :class="CommunityStatusColors[item?.value]"></span>
                                            <span>{{ item.label }}</span>
                                        </template>
                                    </USelectMenu>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="description">Name</label>
                                    <input type="text" class="form-control" id="name" v-model="communityData.name" 
                                        :disabled="!commmunityPrivileges.update || isView"
                                    />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea class="form-control" id="description" rows="10" 
                                        v-model="communityData.description"
                                        :disabled="!commmunityPrivileges.update || isView">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <CustomSubtitle
                            text="Data"
                        />
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="contacts">Links</label>
                                    <div class="w-100 d-flex">
                                        <div v-for="link in links" :key="link">
                                            <NuxtLink :to="link" target="_blank">
                                                {{ link }}
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="provenance">Provenance</label>
                                    <template v-if="communityData._provenance">
                                        <div class="w-100 d-flex">
                                            <a :href="`mailto:${communityData._provenance}`">{{ communityData._provenance }}</a>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="w-100 d-flex">
                                            -
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="provenance">Schema</label>
                                    <div class="w-100 d-flex">
                                        <NuxtLink :to="communityData._schema" target="_blank">
                                            {{ communityData._schema }}
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="contacts">Contacts</label>
                                    <div class="w-100 d-flex">
                                        <div v-for="contact in communityContacts" class="contact-wrapper">
                                            <div class="custom-badget filter-badget"  variant="solid">{{ contact }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="contacts">Keywords</label>
                                    <div class="w-100 d-flex">
                                        <div v-for="keys in communityData.keywords" class="contact-wrapper">
                                            <div class="custom-badget filter-badget" variant="solid">{{ keys }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-footer">
                                <UButton type="button" variant="secondary"
                                    @click="goBack">
                                    Cancel
                                </UButton>
                                <UButton type="submit"
                                    :disabled="!commmunityPrivileges.update">
                                    Submit
                                </UButton>
                            </div>
                        </div>
                    </UForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Community } from "@/types/communities";
import { CommunityStatusLabels, CommunityStatusColors } from '@/constants/community_const';
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { CommunityPrivilegeActions } from '@/constants/privileges';
import { useRouter } from "vue-router";
import type { FormSubmitEvent } from '#ui/types'
import * as v from "valibot";

const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const { data } = useAuth();
const token: string = data?.value.accessToken;

const props = defineProps<{
    communityObj: Community,
    loadingData: boolean,
    commmunityPrivileges: CommunityPrivilegeActions,
    isView: boolean
}>();

const state = ref({
    acronym: '',
    status: '',
    name: '',
    description: ''
});

const schema = v.object({
  acronym: v.pipe(v.string()),
  status: v.pipe(v.string()),
  name: v.pipe(v.string()),
  description: v.pipe(v.string())
});

const errors = ref<string[]>([]);

const communityData = computed(() => {
    state.value = {
        acronym: props.communityObj.acronym,
        status: props.communityObj.status,
        name: props.communityObj.name,
        description: props.communityObj.description
    }
    return props.communityObj;
});

const selectedStatus = computed(() => {
    return props.communityObj.status.charAt(0).toUpperCase() + props.communityObj.status.slice(1)
});

const communityContacts = computed(() => {
    return props.communityObj.community_contact_ids.map((contact: string) => {
        return contact.replace(/\./g, " ");
    })
});

const links = computed(() => {
    if(!props.communityObj || !props.communityObj.links) return [];
    return props.communityObj.links
        .filter((link) => {
            return !link.comment || link.comment !== '@logo';
        })
        .map((link) => link.uri)
        .filter((uri) => uri !== undefined);
});

function goBack() {
    router.push("/dashboard/communities");
}

async function onSubmitCommunity(event: FormSubmitEvent<Schema>) {
    event.preventDefault();

    const result = v.safeParse(schema, state.value);
    if (result.success) {
        const response = await updateCommunity();
        /* TODO */
    } else {
        errors.value = result.error.issues.map(issue => issue.message);
    }
}

async function updateCommunity() {
    const body = {
        acronym: state.value.acronym,
        status: state.value.status,
        name: state.value.name,
        description: state.value.description
    }
    
    try {
        await fetch(
            `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community/${props.communityObj._id}?community_id=${props.communityObj._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(body),
            },
        )
            .then((response) => response.json())
            .then((data) => {
                return data;
            });
    } catch (error) {
        console.error("Error fetching communities data:", error);
    }
 }

</script>

<style scoped lang="scss">
    .dashboard-community-edit {
        &__title {
            padding-bottom: 20px;
            padding-top: 20px;
            h2 {
                border-color: rgb(226, 232, 240, 1);
                border-bottom-width: 1px;
            }
        }
        &__skeleton {
            &__small {
                width: 100%;
                height: 50px;
            }
            &__big {
                width: 100%;
                height: 250px;
            }
        }
        .contact-wrapper {
            margin-right: 5px;
            margin-bottom: 5px;
            background-color: #e9ecef;
            padding: 0.45rem 0.8rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            line-height: 1;
        }
        &__content {
            a {
                color: theme("colors.primary.500");
                text-decoration: none;
            }
            .form-group {
                padding-bottom: 20px;
            }
        }
    }
</style>