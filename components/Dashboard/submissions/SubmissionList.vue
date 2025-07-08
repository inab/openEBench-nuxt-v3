<template>
  <div class="dashboard-community-edit">
    <div class="contribution-header max-w-6xl mx-auto mb-6">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div class="flex-shrink-0 w-full md:w-1/4 text-center md:text-left">
          <img
            src="assets/images/dashboard/contribute.jpg"
            alt="Your contributions"
            class="w-48 h-auto mx-auto md:mx-0 rounded-lg"
          />
        </div>

        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Your Submission History
          </h2>

          <p class="text-gray-600 mb-4 text-sm leading-6">
            Here you can track all your submitted ideas, suggestions, and
            feedback. Every contribution is reviewed and contributes to the
            development of our community.
          </p>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mb-4">
            <p class="italic text-gray-700 text-sm leading-5">
              "What you share today could become tomorrow's improvement. Thank
              you for being part of this process."
            </p>
          </div>

          <p class="text-xs text-gray-500">
            Want to contribute more?
            <NuxtLink to="/dashboard/contribute" class="dashboard-link"
              >Start a new submission</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>

    <div class="dashboard-body">
      <div class="flex items-center justify-end mb-4">
        <div class="w-48">
          <multiselect
            v-model="selectedStatus"
            :options="submissionStatus"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="true"
            :preserve-search="false"
            placeholder="Filter by status"
            :preselect-first="false"
            :searchable="false"
            :taggable="false"
            label="label"
            track-by="value"
          >
            <template #selection="{ values, search, isOpen }">
              <div
                v-for="value in values"
                :key="value.value"
                class="selector-label"
                :class="value.color"
              >
                <span>{{ value.label }}</span>
                <i
                  tabindex="1"
                  class="multiselect__tag-icon"
                  @click="removeTag(value)"
                />
              </div>
            </template>

            <template #option="props">
              <span class="d-flex items-center gap-2">
                <span
                  class="h-2 w-2 rounded-full"
                  :class="getDotColor(props.option.value)"
                ></span>
                <span>{{ props.option.label }}</span>
              </span>
            </template>
          </multiselect>
        </div>
      </div>

      <div class="row row-spacing">
        <div
          v-for="submission in filteredSubmissions"
          :key="submission.id"
          class="submission-card flex flex-col p-4 border rounded-lg"
        >
          <div>
            <h3 class="font-bold mb-1">{{ submission.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">
              {{
                submission.entityType === "community"
                  ? "Community:"
                  : "Challenge:"
              }}
              <strong>{{ submission.entityName }}</strong>
            </p>

            <span
              class="inline-block mt-2 px-3 py-1 text-xs rounded-full"
              :class="getStatusInfo(submission.status).color"
            >
              {{ getStatusInfo(submission.status).label }}
            </span>

            <p v-if="submission.feedback" class="mt-2 text-sm text-gray-700">
              <strong>Feedback:</strong> {{ submission.feedback }}
            </p>
          </div>

          <div class="mt-auto pt-3 flex justify-between">
            <p class="text-xs text-gray-500 mb-0">
              Submitted on:
              {{ new Date(submission.submittedAt).toLocaleDateString() }}
            </p>
            <button class="submission-btn" @click="openModal(submission)">
              <UIcon name="i-heroicons-pencil-square-solid" class="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
    <CustomModal
      :is-open="isModalOpen"
      width="600"
      class="dashboard-contacts-modal"
      @modal-close="closeModal"
    >
      <template #header>
        <div class="modal-title">Edit Submission</div>
        <button
          class="modal-close"
          aria-label="Close modal"
          @click="closeModal"
        >
          <UIcon name="i-heroicons-x-mark-16-solid" />
        </button>
      </template>
      <template #content>
        <div class="w-100">
          <UForm
            :schema="schema"
            :state="selectedSubmission"
            class="space-y-4"
            @submit="onSubmissionUpdate"
          >
            <div class="w-100">
              <div class="row pb-3">
                <div class="col-12">
                  <label for="id">
                    Title
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <input
                      id="title"
                      v-model="selectedSubmission.title"
                      name="title"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Title"
                    />
                  </div>
                </div>
              </div>
              <div class="row pb-3">
                <div class="col-6">
                  <label for="id">
                    Entity ID
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <UInput
                      id="entityId"
                      v-model="selectedSubmission.entityId"
                      name="entityId"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Entity ID"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <label for="id">
                    Entity name
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <input
                      id="entityName"
                      v-model="selectedSubmission.entityName"
                      name="entityName"
                      type="text"
                      class="form-control custom-entry-input"
                      placeholder="Entity Name"
                    />
                  </div>
                </div>
              </div>
              <div class="row pb-3">
                <div class="col-6">
                  <label for="id">
                    Status
                    <span class="text-red-400 required">*</span>
                  </label>
                  <div class="w-100">
                    <USelect
                      v-model="selectedSubmission.status"
                      class="w-full custom-select-input"
                      :options="statusOptions"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="form-footer pt-3">
                  <UButton
                    type="button"
                    color="white"
                    variant="solid"
                    @click="closeModal"
                  >
                    Cancel
                  </UButton>
                  <UButton class="" type="submit"> Submit </UButton>
                </div>
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #footer>
        <div class="form-footer"></div>
      </template>
    </CustomModal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import Multiselect from "vue-multiselect";
import { object, string, number, optional } from "valibot";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import CustomModal from "@/components/Common/CustomModal.vue";

interface Submission {
  id: number;
  entityType: string;
  entityId: number;
  entityName: string;
  title: string;
  status: number;
  submittedAt: string;
  feedback?: string;
}

const submissionStatus = [
  { value: "1", label: "Pending", color: "bg-amber-100 text-amber-800" },
  { value: "2", label: "Under Review", color: "bg-blue-100 text-blue-800" },
  { value: "3", label: "Accepted", color: "bg-green-100 text-green-800" },
  { value: "4", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "5", label: "Implemented", color: "bg-purple-100 text-purple-800" },
];

const isModalOpen = ref<boolean>(false);
const selectedSubmission = ref<Submission>({});

const statusOptions = [
  { value: "all", label: "All", color: "" },
  ...submissionStatus,
];

const selectedStatus = ref<
  Array<{ value: string; label: string; color: string }>
>([]);

const schema = object({
  id: number(),
  entityType: string(),
  entityId: number(),
  entityName: string(),
  title: string(),
  status: number(),
  submittedAt: string(),
  feedback: optional(string()),
});

const mockSubmissions = ref<Submission[]>([
  {
    id: 1,
    entityType: "community",
    entityId: 1,
    entityName: "Community OEB002",
    title: "Submission to participate at Community OEB002",
    status: 1,
    submittedAt: "2024-06-10T14:30:00Z",
  },
  {
    id: 2,
    entityType: "community",
    entityId: 2,
    entityName: "AI Creators",
    title: "Application to join AI Creators",
    status: 2,
    submittedAt: "2024-06-15T09:20:00Z",
  },
  {
    id: 3,
    entityType: "challenge",
    entityId: 101,
    entityName: "Sustainability Hack",
    title: "Eco-friendly Dashboard Design",
    status: 3,
    submittedAt: "2024-05-30T16:45:00Z",
  },
  {
    id: 4,
    entityType: "challenge",
    entityId: 102,
    entityName: "Blockathon",
    title: "Decentralized Identity Solution",
    status: 4,
    submittedAt: "2024-04-12T11:10:00Z",
    feedback: "Lack of technical details in the proposal.",
  },
]);

const closeModal = () => {
  isModalOpen.value = true;
};

const openModal = (item: Submission) => {
  selectedSubmission.value = item;
  isModalOpen.value = true;
};

const getStatusInfo = (statusId: string | number) => {
  const status = submissionStatus.find((s) => s.value === statusId.toString());
  return (
    status || {
      value: "0",
      label: "Unknown",
      color: "bg-gray-100 text-gray-800",
    }
  );
};

const filteredSubmissions = computed(() => {
  if (selectedStatus.value.length === 0) {
    return mockSubmissions.value;
  }

  const selectedValues = selectedStatus.value.map((s) => s.value);

  if (selectedValues.includes("all")) {
    return mockSubmissions.value;
  }

  return mockSubmissions.value.filter((submission) =>
    selectedValues.includes(submission.status.toString()),
  );
});

function removeTag(tag: any) {
  selectedStatus.value = selectedStatus.value.filter(
    (t) => t.value !== tag.value,
  );
}

function getDotColor(statusValue: string) {
  const status = submissionStatus.find((s) => s.value === statusValue);
  return status?.color || "bg-gray-100 text-gray-800";
}

async function onSubmissionUpdate(event: FormSubmitEvent<Schema>) {
  const index = mockSubmissions.value.findIndex(
    (sub) => sub.id === selectedSubmission.value.id,
  );

  if (index !== -1) {
    mockSubmissions.value[index] = selectedSubmission.value;
  }

  isModalOpen.value = false;
}
</script>

<style scoped lang="scss">
.dashboard-community-edit-header {
  &__title {
    padding-bottom: 20px;
    padding-top: 20px;
    h2 {
      border-color: rgb(226, 232, 240, 1);
      border-bottom-width: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      span {
        padding-bottom: 5px;
      }
      a {
        padding: 5px 10px;
        font-size: 14px;
        text-decoration: none;
        margin-bottom: 5px;
      }
    }
  }
}
.dashboard__description {
  display: flex;
  padding-bottom: 50px;
  &__image {
    margin-right: 40px;
    img {
      max-height: 400px;
    }
  }
  &__text {
    font-size: 16px;
    line-height: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.row-spacing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.submission-card {
  display: flex;
  flex-direction: column;
  min-height: 180px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .submission-btn {
    border-radius: 20px;
    background-color: theme("colors.primary.500");
    border: 1px solid theme("colors.primary.500");
    color: white;
    font-size: 14px;
    padding: 5px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    span {
      font-size: 10px;
    }
    &:hover {
      background-color: white;
      color: theme("colors.primary.500");
    }
  }
}

.form-footer {
  display: flex;
  justify-content: end;
  gap: 10px;
}
</style>
