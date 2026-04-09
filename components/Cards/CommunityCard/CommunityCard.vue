<template>
  <div class="h-100 community-card">
    <div
      class="community-card__item max-w-sm rounded overflow-visible text-zinc-700 cursor-pointer"
    >
      <!-- Clickable image + acronym + header area -->
      <div class="community-card__item__image" @click="handleNavigation">
        <div
          class="community-card__item__image__box"
          :style="{ backgroundImage: 'url(' + logo + ')' }"
        ></div>
      </div>
      <div class="community-card__item__acronym font-bold text-xl" @click="handleNavigation">
        {{ acronym }}
      </div>

      <div class="community-card__item__body">
        <!-- Name header is clickable -->
        <div class="w-100 community-card__item__body__header" @click="handleNavigation">
          <div class="w-100">
            {{ name }}
          </div>
        </div>

        <!-- Badges row — each badge handles its own navigation, stops propagation -->
        <div class="community-card__item__body__content__wrapper">
          <!-- Events badge → goes to /events -->
          <div
            v-if="benchmarkingEvents && benchmarkingEvents.length > 0"
            class="inline-block bg-primaryOeb-150 text-primaryOeb-950 custom-badget btn-custom-badget rounded-full font-semibold text-gray-700"
            title="View events"
            @click.stop="router.push(`${to}/events`)"
          >
            <font-awesome-icon :icon="['far', 'calendar-check']" />
            {{ benchmarkingEvents.length }}
            {{ pluralize("Events", benchmarkingEvents.length) }}
          </div>

          <!-- Status badge — not a link, no navigation needed -->
          <div
            class="inline-block rounded-full text-primaryOeb-950 custom-badget font-semibold text-gray-700"
            :class="`status-${status}`"
          >
            <div
              class="text-xs font-normal leading-none max-w-full flex-initial font-semibold"
              :title="`${'Status'} ${status}`"
            >
              {{ status }}
            </div>
          </div>

          <!-- Reference tools badge -->
          <div
            v-if="referenceTools.length > 0"
            class="inline-block bg-gray-200 rounded-full text-primaryOeb-950 custom-badget btn-custom-badget font-semibold text-gray-700"
            @click.stop="router.push(`${to}/tools`)"
          >
            <font-awesome-icon :icon="['fas', 'gear']" />
            {{ referenceTools.length }}
            {{ pluralize("Tools", referenceTools.length) }}
          </div>
        </div>

        <!-- Footer: Current Event button + dropdown -->
        <div class="community-card__item__body__footer">
          <!-- Current Event button → navigates to `to` -->
          <button
            class="text-primaryOeb-500 hover:bg-primaryOeb-50 rounded p-2"
            @click.stop="router.push(to)"
          >
            <span class="text-primaryOeb-500 uppercase font-semibold text-sm">
              Current Event
            </span>
          </button>

          <!-- Dropdown — stops propagation so the card click doesn't fire -->
          <div class="dropdown community-card__item__dropdown" @click.stop>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import pluralize from "pluralize";

const router = useRouter();

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

// Fixed: was using filter() but returning objects inside it (should be map + filter)
const itemsCommunityLinks = computed(() => {
  if (!props.links) return [];
  return props.links
    .filter((item: any) => item.comment !== "@logo")
    .map((item: any) => ({
      label: item.label,
      uri: item.uri,
      icon: "i-heroicons-link",
    }));
});

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

const handleNavigation = () => {
  router.push(props.to);
};
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
      cursor: pointer;
      div {
        border: none;
      }
    }
    &__content {
      &__wrapper {
        display: flex;
        gap: 10px;
        padding-bottom: 35px;
        .custom-badget {
          padding: 0px 15px;
          height: 28px;
          display: flex;
          align-items: center;
          font-size: 12px;
          gap: 5px;
        }
        .btn-custom-badget {
          cursor: pointer;
          &:hover {
            filter: brightness(0.95);
          }
        }
      }
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: end;
      button span {
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