<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2 class="text-primaryOeb-500">Edit Community</h2>
            </div>
            privileges: {{  commmunityPrivileges }}
            <div class="" v-if="loadingData">
                <div class="space-y-2">
                    <USkeleton class="dashboard-community-edit__skeleton__small" />
                    <USkeleton class="dashboard-community-edit__skeleton__big" />
                </div>
            </div>
            
            <div class="dashboard-community-edit__content" v-else>
                <div class="">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                        <div class="row">
                            <div class="col-8">
                                <div class="form-group">
                                    <label for="acronym">Acronym</label>
                                    <input type="text" class="form-control" id="acronym" v-model="communityData.acronym"
                                        :disabled="!commmunityPrivileges.update" />
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="status">Status</label>
                                    <USelect v-model="selectedStatus" :options="CommunityStatusLabels"
                                    :disabled="!commmunityPrivileges.update" />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="description">Name</label>
                                    <input type="text" class="form-control" id="name" v-model="communityData.name" 
                                        :disabled="!commmunityPrivileges.update"
                                    />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea class="form-control" id="description" rows="10" 
                                        v-model="communityData.description"
                                        :disabled="!commmunityPrivileges.update">
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
                                        <div v-for="link in links" :key="link" class="contact-wrapper">
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
                                    <div class="w-100 d-flex">
                                        <a :href="`mailto:${communityData._provenance}`">{{ communityData._provenance }}</a>
                                    </div>
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
                                            <UBadge color="primary" variant="solid">{{ contact }}</UBadge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="contacts">Keywords</label>
                                    <div class="w-100 d-flex">
                                        <div v-for="keys in communityData.keywords" class="contact-wrapper">
                                            <UBadge color="primary" variant="solid">{{ keys }}</UBadge>
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
import { computed } from "vue";
import { Community } from "@/types/communities";
import { CommunityStatusLabels } from '@/constants/community_const';
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { CommunityPrivilegeActions } from '@/constants/privileges';
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
    communityObj: Community,
    loadingData: boolean,
    commmunityPrivileges: CommunityPrivilegeActions
}>();

const communityData = computed(() => {
    return props.communityObj;
});

const selectedStatus = computed(() => {
    return props.communityObj.status;
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
        }
    }
</style>