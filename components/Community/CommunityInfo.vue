<template>
  <div class="community-info">
    <div class="community-info__header">
      <UAccordion
        :items="HEADER_ITEM"
        :ui="{ tab: { active: 'cursor-text select-text' } }"
      >
        <template #item="{ item }">
          <p class="italic text-gray-900 dark:text-white text-center">
            {{ item.label }}
          </p>
          <p class="">
            {{ item.description }}
          </p>
        </template>
        <template #default="{ item, open }">
          <UButton
            color="primary"
            variant="ghost"
            class="border-b border-slate-50 dark:border-gray-700 community-info__header__collapse__btn"
            :ui="{ rounded: 'rounded-none' }"
          >
            <div class="truncate primary">
              <div class="text-left community-info__title">
                {{ item.label }}
                <div class="community-info__title__icon">
                  <UIcon
                    name="i-heroicons-chevron-right-20-solid"
                    class="transform transition-transform duration-200"
                    :class="[open && 'rotate-90']"
                  />
                </div>
              </div>
              <div class="text-left community-info__subtitle">
                {{ community.name }}
              </div>
            </div>
          </UButton>
        </template>
        <template #acronym>
          <div class="community-info__header__body">
            <div class="row">
              <div class="col-2 community-info__header__body__left">
                <img :src="community.logo" alt="welcome-header-image" />
              </div>
              <div class="col-10 community-info__header__body__right">
                <div class="w-100 community-info__header__body__right__row">
                  {{ community.description }}
                </div>
                <div
                  v-if="community.keywords"
                  class="community-info__header__body__right__row"
                >
                  <span class="font-semibold">Keywords:</span>
                  <span class="font-bold">{{
                    community.keywords.join(", ")
                  }}</span>
                </div>
                <div
                  v-if="communityReferences && communityReferences.length > 0"
                  class="community-info__header__body__right__row"
                >
                  <div class="w-100 d-flex">
                    <span class="font-semibold">References:</span>
                    <div
                      v-for="(reference, index) in communityReferences"
                      :key="index"
                      class="community-info__header__link text-primaryOeb-500"
                    >
                      <a :href="reference.href" target="_blank">
                        <span title="Go to Reference">
                          {{ reference.doi }}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  v-if="communityLinks && communityLinks.length > 0"
                  class="community-info__header__body__right__row"
                >
                  <div class="w-100 d-flex">
                    <span class="font-semibold">Links:</span>
                    <div
                      v-for="(link, index) in communityLinks"
                      :key="index"
                      class="community-info__header__link text-primaryOeb-500"
                    >
                      <span :title="`Go to ${link.label}`">
                        <a :href="link.uri" target="_blank">{{ link.label }}</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UAccordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  community: any;
  communityReferences: any[];
}>();

const HEADER_ITEM = [
  {
    label: props.community.acronym ? props.community.acronym : "",
    description: props.community.description,
    defaultOpen: true,
    slot: "acronym",
  },
];

const communityLogo = computed(() => {
  return props.community.links.forEach(
    (link: { comment: string; uri: any }) => {
      if (link.comment === "@logo") {
        return link.uri;
      }
    },
  );
});

const communityLinks = computed(() => {
  if (!props.community.links) return [];
  return props.community.links.filter((link: { comment: string }) => {
    if (link.comment !== "@logo") {
      return link;
    }
  });
});
</script>

<style scoped lang="scss">
.community-info {
  padding-bottom: 40px;
  .community-info__header {
    &__collapse__btn {
      padding: 0;
      &:hover {
        background-color: white;
      }
    }
    &__link {
      padding-right: 10px;
    }
  }
  .community-info__header__body {
    padding-bottom: 20px;
    padding-top: 10px;
    &__right {
      &__row {
        padding-top: 10px;
        padding-bottom: 10px;
        span {
          padding-right: 10px;
        }
        a {
          text-decoration: none;
          color: theme("colors.gray.500");
          font-weight: 600;
          &:hover {
            color: theme("colors.primary.300");
          }
        }
      }
    }
    &__left {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        max-width: 400px;
      }
    }
  }
  .community-info {
    &__title {
      font-size: 35px;
      font-weight: 600;
      padding-bottom: 5px;
      line-height: 2.5rem;
      letter-spacing: 0.0073529412em !important;
      display: flex;
      &__icon {
        margin-left: 10px;
        margin-top: 5px;
      }
    }
    &__subtitle {
      font-size: 16px;
      font-weight: 400;
      padding-bottom: 5px;
      color: black;
    }
  }
}
</style>
