<template>
  <div
    class="nav-link flex md:inline-flex items-center hover:bg-gray-50 space-x-2"
  >
    <div class="">
      <NuxtLink v-if="globalStatus" to="/status/" title="Server status is OK">
        <span class="status-ok" alt="Server status is OK"
          ><font-awesome-icon :icon="['fas', 'signal']"
        /></span>
      </NuxtLink>
      <NuxtLink v-else to="/status/" title="There is an error in some service">
        <span class="status-error" alt="Server status error"
          ><font-awesome-icon :icon="['fas', 'signal']"
        /></span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const runtimeConfig = useRuntimeConfig();
const vreServicesUrl = `${runtimeConfig.public.VRE_URI}`;
const scientificUrl = `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL}`;
const keycloakUrl = `${runtimeConfig.public.KEYCLOAK_HOST}`;
const observatoryUrl = `${runtimeConfig.public.OBSERVATORY_API_URL}`;

const isVreServicesUp = ref(null);
const isScientificServicesUp = ref(null);
const isKeycloakServiceUp = ref(null);
const isObservatoryServiceUp = ref(null);

const globalStatus = computed(() => {
  if (
    isVreServicesUp.value &&
    isScientificServicesUp.value &&
    isKeycloakServiceUp.value &&
    isObservatoryServiceUp.value
  ) {
    return true;
  }
  return false;
});

const checkVreServices = async () => {
  return fetch(`https://api.allorigins.win/raw?url=${vreServicesUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then(async (response) => {
      const text = await response.text();
      isVreServicesUp.value = response.ok && text.trim().length > 0;
    })
    .catch((error) => {
      return false;
    });
};

const checkScientificServices = async () => {
  return fetch(`https://api.allorigins.win/raw?url=${scientificUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then(async (response) => {
      const text = await response.text();
      isScientificServicesUp.value = response.ok && text.trim().length > 0;
    })
    .catch((error) => {
      console.log("Error on fetch");
      return false;
    });
};
const checkKeycloakServices = async () => {
  return fetch(`https://thingproxy.freeboard.io/fetch/${keycloakUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then(async (response) => {
      const text = await response.text();
      isKeycloakServiceUp.value = response.ok && text.trim().length > 0;
    })
    .catch((error) => {
      return false;
    });
};

const checkObservatoryServices = async () => {
  return fetch(`${observatoryUrl}/stats/tools/count_total`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const text = await response.json();
      isObservatoryServiceUp.value = response.ok && text.length > 0;
    })
    .catch((error) => {
      console.log("Observatory error: ", error);
      return false;
    });
};

onMounted(() => {
  checkVreServices();
  checkScientificServices();
  checkObservatoryServices();
  checkKeycloakServices();
});
</script>

<style scoped lang="scss">
.status-ok {
  color: #a0c878;
}
.status-error {
  color: #e52020;
  animation: pulseanim 1.7s 3 ease-in-out;
}
@keyframes pulseanim {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
