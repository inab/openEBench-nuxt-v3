<template>
  <div class="dashboard-contacts">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">
        <div class="dashboard__header__title">
          <h2 class="text-primaryOeb-500">Contacts</h2>
        </div>
        <div class="contacts__body">
          <div class="dashboard__description text-gray-500">
            Communities in OpenEBench utilize a centralized contact register to
            facilitate connections and collaboration among members. This
            platform allows participants to easily identify and connect with
            experts in specific areas, fostering knowledge sharing,
            partnerships, and the growth of the OpenEBench community.
          </div>
          <ContactsList :contacts-data="constactsList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ContactsList from "@/components/Dashboard/contacts/ContactsList.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

definePageMeta({
  middleware: "auth",
  auth: {
    authenticatedOnly: true,
    navigateUnauthenticatedTo: "/login-required",
  },
});

const { data, status } = useAuth();
const runtimeConfig = useRuntimeConfig();

const routeArray: Array = [
  { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
  { label: "Contacts", isActualRoute: true },
];

const token: string = data?.value.accessToken;
const isLoadingContacts = ref(false);
const constactsList = ref<string[]>([]);

await fetchContacts(token);
async function fetchContacts(token: string): Promise<Metric[]> {
  isLoadingContacts.value = true;
  try {
    const response = await fetch(
      `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    const data = await response.json();
    data.map((contact) => {
      contact.fullName = `${contact.givenName} ${contact.surname}`;
      if (!contact.notes || contact.notes === "Unknown") {
        contact.notes = null;
      }
      if (contact.community_id) {
        contact.community_id = contact.community_id.split(",");
      }
      return contact;
    });
    constactsList.value = data;
    return data;
  } catch (error) {
    return [];
  } finally {
    isLoadingContacts.value = false;
  }
}
</script>
