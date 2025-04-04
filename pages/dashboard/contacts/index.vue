<template>
  <div class="dashboard-contacts">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="w-100 container">
      <div v-if="status == 'authenticated'">
        <UAccordion :items="HEADER_ITEM">
          <template #item="{ item }">
            <div class="dashboard__header__title">
              <h2 class="text-primaryOeb-500">{{ item.label }}</h2>
            </div>
          </template>
          <template #default="{ item, open }">
            <UButton
              color="primary"
              variant="ghost"
              class="border-b border-slate-200 dark:border-gray-700 community-collapse-btn"
              :ui="{ rounded: 'rounded-none' }"
            >
              <div class="primary label-btn">
                <h2>{{ item.label }}</h2>
              </div>
              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
              </template>
            </UButton>
          </template>
          <template #contacts>
            <div class="accordion_contacts__body">
              <div class="dashboard__description text-gray-500">
                <div class="dashboard__description__image">
                  <img
                    src="assets/images/dashboard/contacts.jpg"
                    alt="Contacts image"
                    class="metrics__body__img"
                  />
                </div>
                <div class="dashboard__description__text">
                  <div class="w-100">
                    Communities in OpenEBench utilize a centralized contact
                    register to facilitate connections and collaboration among
                    members. This platform allows participants to easily
                    identify and connect with experts in specific areas,
                    fostering knowledge sharing, partnerships, and the growth of
                    the OpenEBench community.
                  </div>
                  <div class="w-100 d-flex justify-content-end pt-5">
                    <NuxtLink
                      id="dashboard-create-contact"
                      to="/dashboard/contacts/add"
                      class="btn custom-btn btn-primary mb-2 small"
                      title="Create new contact"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />
                      Create New Contact
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
        <div class="contacts__body">
          <div class="dashboard__description text-gray-500"></div>
          <ContactsList
            :contacts-data="contactsList"
            :token="token"
            :is-loading="isLoadingContacts"
          />
        </div>
      </div>
      <div class="" v-else>
        User is not authenticated
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ContactsList from "@/components/Dashboard/contacts/ContactsList.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import type { Contact } from "@/types/contact";

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

const HEADER_ITEM = [
  {
    label: "Contacts",
    defaultOpen: true,
    slot: "contacts",
  },
];

const token: string = data?.value.accessToken;
const isLoadingContacts = ref(false);
const contactsList = ref<Contact[]>([]);

async function fetchContacts(token: string): Promise<Contact[]> {
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

    data.sort((a: Contact, b: Contact) => {
      if (a.surname < b.surname) {
        return -1;
      }
      if (a.surname > b.surname) {
        return 1;
      }
      return 0;
    });

    data.map((contact: Contact) => {
      contact.fullName = `${contact.surname}, ${contact.givenName}`;
      if (!contact.notes || contact.notes === "Unknown") {
        contact.notes = null;
      }
      if (contact.community_id) {
        contact.community_id = contact.community_id.split(",");
      }
      return contact;
    });
    contactsList.value = data;
    return data;
  } catch (error) {
    return [];
  } finally {
    isLoadingContacts.value = false;
  }
}

onMounted(async () => {
  if (token) {
    await fetchContacts(token);
  }
});
</script>

<style lang="scss" scoped>
.dashboard__description {
  display: flex;
  &__image {
    margin-right: 40px;
    img {
      max-height: 400px;
    }
  }
  &__text {
    font-size: 16px;
    line-height: 1.5;
  }
}
.community-collapse-btn {
  padding: 0;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: white;
  }
  span {
    font-size: 30px;
  }
}
</style>
