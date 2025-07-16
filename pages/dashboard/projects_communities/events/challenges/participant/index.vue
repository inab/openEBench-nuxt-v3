<template>
  <div class="community-event-challenge-participant">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="w-100">
        <div class="community-event-challenge__title">
          <h2 class="text-primaryOeb-500">
            OEB Challenge Code: {{ challengeId }} - Challenge Submission
          </h2>
        </div>
        <div class="community-event-challenge__description text-gray-500 pb-4">
          Communities in OpenEBench create focused challenges within their
          benchmarking events. Each challenge centers around a specific
          category, utilizing predefined reference datasets and evaluation
          metrics to compare tools, pipelines, services, or products. These
          tailored competitions drive innovation and allow for in-depth analysis
          of performance within specific domains.
        </div>
      </div>
      <div class="w-100">
        <section class="">
          <UForm class="space-y-4" @submit="onSubmitParticipant">
            <div class="w-100 form-card">
              <div class="form-card__row">
                <div class="form-card__row__box w-100">
                  <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="id">
                          Submission title
                          <span class="text-red-400 required">*</span>
                        </label>
                        <div class="w-100">
                          <input
                            id="id"
                            type="text"
                            class="form-control custom-entry-input"
                            placeholder="Submission title"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="id">
                          Brief description of the method
                        </label>
                        <div class="w-100">
                          <ckeditor :editor="ClassicEditor" :config="config" />
                        </div>
                      </div>
                    </div>
                    <div class="col-5">
                      <div class="form-group">
                        <label for="id"> Category of the model </label>
                        <div class="w-100">
                          <USelect
                            v-model="state.category"
                            class="selector"
                            :options="modelOptions"
                            option-attribute="label"
                            value-attribute="value"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="w-100 form-card">
                      <CustomSubtitle
                        text="Docker image submission"
                        size="22px"
                      />
                      <div class="">
                        You can either upload the Docker image file directory or impor it drom Docker Hub.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UForm>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import TurndownService from "turndown";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Indent,
  IndentBlock,
  List,
  Link,
  Table,
  TableToolbar,
  BlockQuote,
  CodeBlock,
  HorizontalLine,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Heading,
  SourceEditing,
} from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import "ckeditor5/ckeditor5.css";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const route = useRoute();
const eventId: string = route.params.event_id;
const communityId: string = route.params.community_id;
const challengeId: string = route.params.challenge_id;

const config = computed(() => {
  return {
    licenseKey: "GPL",
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      Indent,
      IndentBlock,
      List,
      Link,
      Table,
      TableToolbar,
      BlockQuote,
      CodeBlock,
      HorizontalLine,
      SpecialCharacters,
      SpecialCharactersEssentials,
      Heading,
      SourceEditing,
    ],
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "sourceEditing",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "|",
      "bulletedList",
      "numberedList",
      "bulletedList ",
      "|",
      "link",
      "insertTable",
      "blockQuote",
      "codeBlock",
      "horizontalLine",
      "formatPainter",
      "specialCharacters",
    ],
  };
});

const state = ref({
  category: "predictive models",
});

const modelOptions = [
  { label: "Predictive Models", value: "predictive models" },
  { label: "Genome Assembly", value: "genome assembly" },
  { label: "Other", value: "other" },
];

function onSubmitParticipant() {}

const routeArray: Array = ref([
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  {
    label: `Community ${communityId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}`,
  },
  {
    label: `Event ${eventId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}/events/${eventId}`,
  },
  {
    label: `Challenge ${challengeId}`,
    isActualRoute: false,
    route: `/dashboard/projects_communities/${communityId}/events/${eventId}/challenges/${challengeId}`,
  },
  {
    label: "Challenge submission",
    isActualRoute: true,
  },
]);
</script>

<style scope lang="scss">
.subtitle {
  font-size: 14px;
  //font
}
</style>
