<template>
  <div class="dashboard-contacts">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />

    <div class="w-100 container">
      <div class="text-primaryOeb-500 border-slate-200 border-b mb-3">
        <div class="flex justify-content-between gap-3">
          <h2>Contacts</h2>
          <NuxtLink
            id="dashboard-create-community"
            to="/dashboard/contacts/add"
            class="btn custom-btn btn-primary mb-2"
            title="Create new community"
          >
            Create New Contact
          </NuxtLink>
        </div>
      </div>
      <div v-if="status === 'pending'">Loading ...</div>
      <div v-else-if="status === 'error'">Errors</div>
      <div v-else>
        <div class="dashboard__description text-gray-500">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English.
        </div>
        <ContactsList :contacts-data="dataContacts" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactsList from "@/components/Dashboard/contacts/ContactsList.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const { data } = useAuth();
const runtimeConfig = useRuntimeConfig();
const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Contacts", isActualRoute: true },
];

let token: string | undefined;
if (data.value) {
  token = data.value.accessToken;
}

const { data: dataContacts, status } = await useAsyncData(
  "contactsResult",
  () =>
    $fetch(`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      method: "GET",
    }),
);
</script>
