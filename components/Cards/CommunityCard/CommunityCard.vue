<template>
  <div class="h-100">
    <NuxtLink
      :to="to"
      class="community-card__item max-w-sm rounded overflow-visible text-zinc-700"
    >
      <div class="community-card__item__image">
        <div
          class="community-card__item__image__box"
          :style="{ backgroundImage: 'url(' + logo + ')' }"
        ></div>
      </div>
      <div class="community-card__item__acronym font-bold text-xl">
        {{ acronym }}
      </div>
      <div class="community-card__item__body">
        <div class="w-100 community-card__item__body__header">
          <div class="w-100">
            {{ name }}
          </div>
        </div>
        <div class="community-card__item__body__content__wrapper">
          <div
            v-if="benchmarkingEvents && benchmarkingEvents.length > 0"
            class="inline-block bg-primaryOeb-150 text-primaryOeb-950 custom-badget rounded-full font-semibold text-gray-700"
            title="View events"
          >
            <NuxtLink :to="`${to}/events`" class="text-primaryOeb-950">
              <font-awesome-icon :icon="['far', 'calendar-check']" />
              {{ benchmarkingEvents.length }}
              {{ pluralize("Events", benchmarkingEvents.length) }}
            </NuxtLink>
          </div>
          <div
            class="inline-block rounded-full text-primaryOeb-950 custom-badget font-semibold text-gray-700"
            :class="statusChipColor"
          >
            <div
              class="text-xs font-normal leading-none max-w-full flex-initial font-semibold"
              :title="`${'Status'} ${status}`"
            >
              {{ status }}
            </div>
          </div>
          <div
            v-if="referenceTools.length > 0"
            class="inline-block bg-gray-200 rounded-full text-primaryOeb-950 custom-badget font-semibold text-gray-700"
          >
            <font-awesome-icon :icon="['fas', 'gear']" />
            {{ benchmarkingEvents.length }}
            {{ pluralize("Events", benchmarkingEvents.length) }}
          </div>
        </div>
        <!-- Current Event -->
        <div class="community-card__item__body__footer">
          <button
            class="text-primaryOeb-500 hover:bg-primaryOeb-50 rounded p-2"
          >
            <NuxtLink :to="to" class="text-primaryOeb-500">
              Current Event
            </NuxtLink>
          </button>

          <!-- Dropdown -->
          <div class="dropdown community-card__item__dropdown">
            <button
              id="dropdownMenuButton"
              class="text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-decoration-none"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li v-for="item in itemsCommunityLinks" :key="item.label">
                <a
                  :href="item.uri"
                  class="dropdown-item"
                  target="_blank"
                  @click.stop
                >
                  <span>{{ item.label }}</span>
                  <UIcon
                    name="i-heroicons-arrow-top-right-on-square"
                    class="flex-shrink-0 h-4 w-4 text-gray-800 dark:text-gray-500 ms-2"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import pluralize from "pluralize";

const props = defineProps<{
  _id: string;
  acronym: string;
  name: string;
  logo: string;
  links: any[] | undefined;
  status: string;
  benchmarkingEvents: Array<any>;
  referenceTools: Array<any>;
  summary: string;
  to: string;
}>();

let itemsCommunityLinks: null = null;
if (props.links) {
  itemsCommunityLinks = props.links.filter((item: any) => {
    if (item.comment == "@logo") {
      return;
    }
    return [
      {
        label: item.label,
        href: item.uri,
        icon: "i-heroicons-link",
        target: "_blank",
      },
    ];
  });
}

const statusChipColor = computed(() => {
  switch (props.status) {
    case "active":
      return "bg-green-200";
    case "incubating":
      return "bg-teal-200";
    default:
      return "bg-neutral-300";
  }
});
</script>

<style scoped lang="scss">
.community-card__item {
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100%;
  text-decoration: none;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  &:hover {
    transform: scale(1.05);
  }
  &__image {
    padding: 10px 20px 10px 20px;
    height: 140px;
    a {
      display: block;
      height: 120px;
    }
    &__box {
      height: 120px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
  }
  &__acronym {
    text-align: center;
    padding: 10px 0;
    background-color: #b0d9ff;
  }
  &__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    padding: 10px 15px 15px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.1px;
    line-height: 22px;
    &__header {
      flex: 2;
      text-decoration: none;
      border: none;
      line-height: 1.375rem;
      letter-spacing: 0.0071428571em;
      font-weight: 550;
      padding-bottom: 30px;
      div {
        border: none;
      }
    }
    &__content {
      &__wrapper {
        display: flex;
        gap: 10px;
        padding-bottom: 35px;
        a {
          height: 28px;
          text-decoration: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        .custom-badget {
          padding: 0px 15px;
          height: 28px;
          display: flex;
          align-items: center;
          font-size: 12px;
        }
      }
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: end;
      a {
        text-decoration: none;
        text-transform: uppercase;
        font-weight: 550;
      }
    }
  }
}
.community-card__item__dropdown {
  position: relative;
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1050;
    min-width: 110px;
    margin: 40px !important;
    transform: translateX(-100%) !important;
    pointer-events: auto;
  }
  .dropdown-item {
    text-transform: capitalize;
    display: flex !important;
    align-items: center !important;
  }
}
</style>
