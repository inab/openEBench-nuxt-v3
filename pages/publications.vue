<template>
  <div class="team">
    <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="container">
      <div class="w-100">
        <h2 class="text-primaryOeb-500 mb-4">OpenEBench Publications</h2>

        <p class="text-sm leading-6 mt-3">
          Here, you can find different scientific contributions, e.g. peer-reviewed
          articles, conference posters, and public pre-prints, reflecting the work
          carried out by the OpenEBench team and the multiple collaborations with
          the scientific communities that use and support the platform.
        </p>

        <p class="text-sm leading-6 mt-3">
          These contributions are organized into two sections to reflect whether
          they are core to the OpenEBench activities or contribute to the different
          communities.
        </p>

        <div>
          <h3 class="section-title-border text-2xl font-normal mt-4">Cite Us</h3>
          <hr class="mb-4" />
          <p class="text-sm">
            If you use resources from OpenEBench in your research, please cite us as
            follows:
          </p>
          <p class="text-sm">
            OpenEBench: A benchmarking infrastructure for bioinformatics methods,
            tools, and web services. Part of the ELIXIR Tools platform. Developed by
            the Barcelona Supercomputing Center (BSC) in collaboration with partners
            within ELIXIR and beyond. Available at:
            <a href="https://openebench.bsc.es">https://openebench.bsc.es.</a>
          </p>
        </div>

        <br />

        <div class="community-tabs md:flex">
          <UTabs :items="tabsItems" class="w-full" v-model:selected="selectedTab" @tab-selected="handleTabSelection"
            :ui="{ list: { tab: { active: 'text-primary-500' } } }">
            <template #default="{ item, index, selected }">
              <div class="flex items-center gap-2 relative truncate">
                <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
                <span class="">{{ item.label }}</span>
                <span v-if="selected"
                  class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
              </div>
            </template>

            <template #papers>
              <div class="option-list">
                <ul>
                  <li @click="selectOption('core', 'papers')" :class="{ active: selectedPapersOption === 'core' }">
                    Core Contributions
                  </li>
                  <li @click="selectOption('collaborations', 'papers')"
                    :class="{ active: selectedPapersOption === 'collaborations' }">
                    Collaborations
                  </li>
                </ul>
              </div>
              <div class="content-wrapper border-content">
                <transition name="slide-fade">
                  <div v-if="selectedPapersOption === 'core'" class="content-display">
                    Core Contributions content
                  </div>
                </transition>
                <transition name="slide-fade">
                  <div v-if="selectedPapersOption === 'collaborations'" class="content-display">
                    Collaborations content
                  </div>
                </transition>
              </div>
            </template>

            <template #posters>
              <div class="option-list">
                <ul>
                  <li @click="selectOption('about', 'posters')" :class="{ active: selectedPostersOption === 'about' }">
                    About OEB
                  </li>
                  <li @click="selectOption('mentions', 'posters')"
                    :class="{ active: selectedPostersOption === 'mentions' }">
                    Mentions
                  </li>
                </ul>
              </div>
              <div class="content-wrapper border-content">
                <transition name="slide-fade">
                  <div v-if="selectedPostersOption === 'about'" class="content-display">
                    About OEB content
                  </div>
                </transition>
                <transition name="slide-fade">
                  <div v-if="selectedPostersOption === 'mentions'" class="content-display">
                    Mentions content
                  </div>
                </transition>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const routeArray: { label: string, isActualRoute: boolean }[] = [
  { label: "About", isActualRoute: true },
  { label: "Publications", isActualRoute: true },
];

// Define tabs items
const tabsItems = [
  { label: 'Papers', icon: 'i-heroicons-document-duplicate-16-solid', slot: "papers" },
  { label: 'Posters', icon: 'i-heroicons-document-chart-bar-16-solid', slot: "posters" },
]

// Track the selected tab and selected options for both tabs
const selectedTab = ref<string>('papers');
const selectedPapersOption = ref<string>('core');
const selectedPostersOption = ref<string>('about');

// Function to set the selected option based on the tab
function selectOption(option: string, tab: string) {
  if (tab === 'papers') {
    selectedPapersOption.value = option;
  } else if (tab === 'posters') {
    selectedPostersOption.value = option;
  }
}

// Handle tab selection and set the default option for each tab
function handleTabSelection(selected: string) {
  selectedTab.value = selected;

  if (selected === 'papers' && !selectedPapersOption.value) {
    selectedPapersOption.value = 'core';
  } else if (selected === 'posters' && !selectedPostersOption.value) {
    selectedPostersOption.value = 'about';
  }
}

// Initialize the selected tab and option on page load
onMounted(() => {
  handleTabSelection(selectedTab.value);
});
</script>

<style lang="scss" scoped>
.community-tabs ul {
  margin: 0;
  padding: 0;
  text-align: center;
}

.custom-tab {
  border: 2px solid rgba(243, 244, 246);
  border-radius: 0.5rem;
}

.section-title-border {
  padding-bottom: 5px;
  color: #0b579f;
}

.option-list {
  background-color: #F3F4F6;
  margin-top: -10px;
  padding: 10px;
}

.option-list ul {
  list-style-type: none;
  padding: 0;
}

.option-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.option-list li:hover,
.option-list li.active {
  background-color: #e2e8f0;
}

.content-wrapper {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  background-color: #fff;
  margin-top: 20px;
}

.content-display {
  padding: 20px;
  text-align: center;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
