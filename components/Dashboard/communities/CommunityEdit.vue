<template>
    <div class="dashboard-community-edit">
        <div class="w-100 container">
            <div class="dashboard-community-edit__title">
                <h2>Edit Community</h2>
            </div>
            <div class="dashboard-community-edit__content">
                {{  communityObj }}
                <div class="">
                    <div class="row">
                        <div class="col-8">
                            <div class="form-group">
                                <label for="acronym">Acronym</label>
                                <input type="text" class="form-control" id="acronym" v-model="communityObj.acronym" />
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="status">Status</label>
                                <USelect v-model="selectedStatus" :options="CommunityStatusLabels" />
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label for="description">Name</label>
                            <input type="text" class="form-control" id="name" v-model="communityObj.name" />
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea class="form-control" id="description" v-model="communityObj.description"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Community } from "@/types/communities";
import { CommunityStatusLabels } from '@/constants/community_const'



const props = defineProps<{
    communityObj: Community;
}>();


const selectedStatus = computed(() => {
    return props.communityObj.status;
});
</script>