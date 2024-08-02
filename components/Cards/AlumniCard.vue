<template>
  <div
    class="alumni-card card"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <h5 class="name px-3 mt-3">{{ alumni.name }}</h5>
    <div class="px-3 pb-3 subtitle subtitle-container">
      {{ formattedYears }}
      <div class="worked-on" @click="toggleExpand">
        <span class="worked-on-text" :class="{ 'fade-in': isHovered }">
          worked on
        </span>
        <span class="arrow-icon">
          <font-awesome-icon
            :icon="showRoles ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']"
          />
        </span>
      </div>
    </div>
    <div class="expanded-container">
      <div
        class="expanded-content"
        :class="{ expand: showRoles, collapse: !showRoles }"
      >
        <hr class="mx-3 mt-1" />
        <p class="roles-text px-3">{{ sortedandFormattedRoles }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";

// PROPS
const props = defineProps<{
  alumni: {
    name: string;
    startYear: number;
    endYear: number;
    roles: string[];
  };
}>();

// CONSTANTS
const isHovered = ref(false);
const showRoles = ref(false);

// Computed properties
const formattedYears = computed(
  () => `${props.alumni.startYear} - ${props.alumni.endYear}`,
);

const sortedandFormattedRoles = computed(() => {
  const sorted = props.alumni.roles.slice().sort();
  return sorted.join(", ");
});

// Methods
function toggleExpand() {
  showRoles.value = !showRoles.value;
}
</script>

<style scoped>
.alumni-card {
  border: none;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.alumni-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.worked-on {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.subtitle {
  font-size: 14px;
  font-weight: 300;
}

.worked-on-text {
  font-size: 12px;
  font-weight: 300;
  text-transform: lowercase;
  margin-right: 4px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.fade-in {
  opacity: 1;
}

.arrow-icon {
  font-size: 16px;
  margin-top: 2px;
}

.expanded-container {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.expanded-content {
  max-height: 0; /* Initial state when collapsed */
  transition: max-height 0.3s ease-out;
}

.expand {
  max-height: 200px; /* Adjust based on content height */
}

.collapse {
  max-height: 0;
}

.roles-text {
  font-size: 14px;
}
</style>
