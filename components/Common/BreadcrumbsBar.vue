<template>
    <div class="" v-if="breadcrumbs.length>0">
        This is breadcrumb
        <ul>
            <li v-for="(crumb, index) in breadcrumbs" :key="index">
                {{ crumb.label }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched;

    return matchedRoutes.map((routeItem) => ({
        label: routeItem.meta.breadcrumb || routeItem.name,
        to: getRouterPath(route, routeItem),
    }));
});

function getRouterPath(route: any, routeItem: any) {
    const matchedSegments = route.matched.slice(0, route.matched.indexOf(routeItem) + 1);
    if(matchedSegments.length == 1 && matchedSegments[0].name != 'index') {
        matchedSegments.unshift({ path: "/", name: "Home" });
    }
    return matchedSegments.map((segment: any) => segment.name).join('/');
}

function handleBreadcrumbs(breadValue: any) {
    // TODO
}
</script>