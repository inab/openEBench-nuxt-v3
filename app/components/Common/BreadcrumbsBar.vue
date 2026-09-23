<template>
  <div
    v-if="
      breadcrumbs.length > 0 &&
      breadcrumbs[0].label != 'index' &&
      breadcrumbs[1].label != ''
    "
    class="breadcrumbar"
  >
    <ul class="breadcrumbar__wrapper px-4">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumbar__wrapper__item"
      >
        <div v-if="crumb.label == ''">
          <NuxtLink
            class="breadcrumbar__wrapper__item text-primaryOeb-400"
            to="/"
            >Home</NuxtLink
          >
        </div>
        <div v-else class="breadcrumbar__wrapper__item__group">
          <div class="breadcrumbar__wrapper__item__group__separator">
            <UIcon name="i-heroicons-chevron-right-20-solid" />
          </div>
          <div
            :class="[
              crumb.isActualRoute ? 'text-slate-300' : 'text-primaryOeb-400',
            ]"
          >
            <template v-if="crumb.route">
              <NuxtLink :to="crumb.route" class="breadcrum-title">{{
                getCustomTitle(crumb.label)
              }}</NuxtLink>
            </template>
            <template v-else>
              <span class="breadcrum-title">{{
                getCustomTitle(crumb.label)
              }}</span>
            </template>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();

const props = defineProps<{
  breadcrumbsArray?: Array;
}>();

const routeTitle = {
  benchmarking: "Benchmarking Communities",
};

const breadcrumbs = computed(() => {
  let fullPath = route.fullPath;
  fullPath = fullPath.split("/");

  if (props.breadcrumbsArray) {
    const newRoute = props.breadcrumbsArray;
    newRoute.unshift({ label: "", isActualRoute: false });
    return newRoute;
  } else {
    return fullPath.map((path: string, index: number) => {
      let routeName = route.name;
      let label = path;
      if (routeName == "benchmarking-community") {
        routeName = "benchmarking";
        label = path;
      }
      return {
        label: label,
        isActualRoute: index == fullPath.length - 1,
      };
    });
  }
});

function getRouterPath(route: any, routeItem: any) {
  const matchedSegments = route.matched.slice(
    0,
    route.matched.indexOf(routeItem) + 1,
  );
  if (matchedSegments.length == 1 && matchedSegments[0].name != "index") {
    matchedSegments.unshift({ path: "/", name: "Home" });
  }
  return matchedSegments.map((segment: any) => segment.name).join("/");
}

function getCustomTitle(route: string) {
  return routeTitle[route] ? routeTitle[route] : route;
}
</script>

<style lang="scss" scoped>
.breadcrumbar {
  padding-top: 5px;
  padding-bottom: 35px;
  font-size: 14px;
  .breadcrumbar__wrapper {
    display: flex;
    justify-content: left;
    align-items: baseline;
    list-style: none;
    padding: 0;
    margin: 0;

    .breadcrumbar__wrapper__item {
      text-decoration: none;
      display: flex;
      &:hover {
        text-decoration: none;
      }
      &.active {
        font-weight: bold;
      }
      &__group {
        display: flex;
        &__separator {
          padding: 0 5px;
        }
      }
      a {
        color: theme("colors.primary.500");
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
      }
    }
    .breadcrum-title {
      text-transform: capitalize;
    }
  }
}
</style>
