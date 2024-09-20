<template>
    <div class="community-add">
        <div class="w-100 container">
            <div class="dashboard-community-add__title">
                <h2 class="text-primaryOeb-500 ">
                    <span class="">Add New Community</span>
                </h2>
            </div>
            <div class="dashboard-community-edit__content">
                <div class="">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitCommunity">


                    </UForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Community } from "@/types/communities";
import { useRouter } from "vue-router";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import type { FormSubmitEvent } from '#ui/types'
import * as v from "valibot";

const router = useRouter();

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

</script>

<style scoped lang="scss">

</style>