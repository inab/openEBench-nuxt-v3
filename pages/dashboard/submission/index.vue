<template>
  <div class="dashboard">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div class="contribution-header max-w-6xl mx-auto mb-6">
        <div
          class="flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          <div class="flex-shrink-0 w-full md:w-1/4 text-center md:text-left">
            <img
              src="assets/images/dashboard/submission.jpg"
              alt="Your contributions"
              class="w-48 h-auto mx-auto md:mx-0 rounded-lg"
            />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Your Submission
            </h2>

            <p class="text-gray-600 mb-4 text-sm leading-6">
              Here you can submit your container for validation and assessment.
              Each submission is reviewed and contributes to ensuring the
              quality and reliability of the system.
            </p>
          </div>
        </div>
      </div>
      <SubmissionForm />
    </div>
  </div>
</template>
<script setup lang="ts">
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import SubmissionForm from "@/components/Dashboard/submissions/SubmissionForm.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Submissions", isActualRoute: true },
];
</script>
