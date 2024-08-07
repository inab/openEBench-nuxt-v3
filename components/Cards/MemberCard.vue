<template>
  <div class="d-flex justify-content-center mx-auto">
    <div
      class="my-4 main-card card"
      :max-width="374"
      @mouseover="toggleHovered(true)"
      @mouseleave="toggleHovered(false)"
      @click="handleClickOutside"
    >
      <!-- CHIPS -->
      <div class="chips-container" :class="{ 'show-chips': isHovered }">
        <a
          v-if="member.orcid"
          class="relative grid select-none items-center whitespace-nowrap rounded-full bg-gray-900/10 py-1.5 px-3"
          target="_blank"
          :href="member.orcid"
        >
          <img :src="imgOrcid" alt="Orcid logo" class="logo chip-with-logo" />
        </a>
        <a
          v-if="member.github"
          class="relative grid select-none items-center whitespace-nowrap rounded-full bg-gray-900/10 py-1.5 px-3"
          target="_blank"
          :href="member.github"
        >
          <img
            src="~/assets/images/teams/github-logo.png"
            alt="Github logo"
            class="logo chip-with-logo"
          />
        </a>
      </div>

      <!-- AVATAR -->
      <div class="circle-container">
        <div class="outer-circle">
          <div class="inner-circle">
            <img
              :src="imageUrl"
              :alt="getMemberAltText(member)"
              class="object-cover w-full h-full rounded-full grayscale-image"
            />
          </div>
        </div>
      </div>

      <h5 class="name px-3 mt-5">{{ member.name }}</h5>
      <div class="px-3 pb-3 subtitle-container">
        <div
          v-for="(institution, idx) in member.institution"
          :key="idx"
          class="d-inline-block me-1"
        >
          <div class="position-relative d-inline-block">
            <a
              href="#"
              class="institution-link text-sm"
              @mouseover="showTooltip(idx)"
              @mouseleave="hideTooltip(idx)"
              @click.prevent="navigateToLink(institution.trim())"
            >
              {{ institution.trim() + "," }}
            </a>
            <span v-if="idx < member.institution.length - 1">&nbsp;</span>
            <div v-if="tooltipVisible[idx]" class="tooltip bs-tooltip-bottom">
              <div class="tooltip-inner">
                {{ getInstitutionFullName(institution).name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- Roles toggle without transition -->
        <div class="roles-toggle" @click.stop="toggleRoles">
          <span class="roles-text">Roles </span>
          <span class="arrow-icon">
            <font-awesome-icon
              :icon="
                isRolesExpanded
                  ? ['fas', 'chevron-down']
                  : ['fas', 'chevron-up']
              "
            />
          </span>
        </div>

        <!-- Roles container with Vue transition -->
        <div v-if="isRolesExpanded" class="roles-container">
          <h5 class="roles-title">Takes part on:</h5>
          <ul class="roles-list">
            <li
              v-for="(role, index) in sortedRoles"
              :key="index"
              class="role-item"
            >
              {{ role }}
            </li>
          </ul>
          <div class="close-button" @click.stop="closeRoles">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";

import imgOrcid from "/images/illustrations/orcid.svg";

// PROPS
const props = defineProps<{
  member: {
    image: string;
    name: string;
    institution: string[];
    orcid: string;
    github: string;
  };
  institutionMapping: Object;
}>();

// CONSTANTS
const isHovered = ref(false);
const isRolesExpanded = ref(false);
const images = import.meta.glob("@/assets/images/members/*.{jpg,jpeg,png}", {
  eager: true,
});
const tooltipVisible = ref<boolean[]>(
  Array(props.member.institution.length).fill(false),
);

// COMPUTED
const imageUrl = computed(() => {
  const imageName = props.member.image.replace(/^\//, ""); // Eliminar cualquier barra inicial
  const image = images[`/assets/images/members/${imageName}`];
  return image ? image.default : "";
});

const sortedRoles = computed(() => {
  return props.member.roles.slice().sort();
});

// METHODS
function getMemberAltText(member) {
  return `Photo of ${member.name}`;
}

// Tooltip institutions
function showTooltip(index: number) {
  tooltipVisible.value[index] = true;
}

function hideTooltip(index: number) {
  tooltipVisible.value[index] = false;
}

function navigateToLink(institution) {
  const institutionInfo = getInstitutionFullName(institution);
  if (institutionInfo.link) {
    window.open(institutionInfo.link, "_blank");
  }
}

function getInstitutionFullName(acronym) {
  const institution = props.institutionMapping[acronym];
  if (institution) {
    return { name: institution.name, link: institution.link };
  }
  return { name: acronym, link: "#" };
}

function toggleHovered(value) {
  isHovered.value = value;
}

// Roles
function toggleRoles() {
  isRolesExpanded.value = !isRolesExpanded.value;
}

function closeRoles() {
  isRolesExpanded.value = false;
}

function handleClickOutside() {
  if (isRolesExpanded.value) {
    closeRoles();
  }
}
</script>

<style scoped>
/* Main card styles */
.main-card {
  position: relative;
  border: none;
  min-width: 340px;
  max-width: 345px;
  min-height: 250px;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  cursor: default;
}

.main-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 20%);
  transition: box-shadow 0.3s ease-in-out;
}

.main-card:hover .grayscale-image {
  filter: none;
}

/* Chips styles */
.chip-with-logo {
  margin-bottom: 2px;
}

.chip:hover {
  background-color: darkgray;
}

.logo {
  width: 20px;
  height: 20px;
}

/* Chips container transition */
.chips-container {
  position: absolute;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  transition:
    top 0.3s ease,
    opacity 0.3s ease;
  top: -15%; /* Initially hidden off-screen */
  opacity: 0;
}

.show-chips {
  top: 10px; /* Slide in when hovered */
  opacity: 1;
}

/* Circle container styles */
.circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.outer-circle {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 10px solid #0b579f;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.inner-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 10px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.grayscale-image {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle-container {
  display: inline-block;
}

/* Institution link styles */
.institution-link {
  cursor: pointer;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  outline: none;
  white-space: nowrap;
}

.institution-link:hover {
  text-decoration: underline;
  color: #0b579f;
}

.tooltip {
  position: absolute;
  z-index: 10;
  display: block;
  width: max-content;
  max-width: 400px;
  margin: 0;
  padding: 0.3rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 0.25rem;
  opacity: 0.75;
  transition: opacity 0.3s ease;
}

.tooltip-inner {
  max-width: 400px;
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0);
}

/* Roles toggle styles */
.roles-toggle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background-color: #0b579f;
  color: white;
  border-top-left-radius: 80px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 10px;
}

.roles-toggle:hover {
  background-color: #083864;
}

.roles-text {
  font-size: 12px;
  margin-right: -2px;
  margin-top: 25px;
  margin-left: 10px;
}

.arrow-icon {
  color: white;
  font-size: 10px;
  margin-left: 5px;
  margin-top: 25px;
}

/* Roles container styles */
.roles-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #0b579f;
  color: white;
  padding: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow-y: auto;
  max-height: 50%; /* Expand to half the card */
}

.roles-title {
  margin-bottom: 10px;
}

.roles-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.role-item {
  margin-bottom: 8px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: rgb(212, 212, 212);
}

/* Media queries for responsiveness */
@media (max-width: 1024px) and (orientation: portrait),
  (max-width: 1366px) and (orientation: landscape) {
  .chips-container {
    top: 10px;
    opacity: 1;
  }

  /* Main card styles */
  .main-card {
    position: relative;
    border: none;
    min-width: 305px;
    max-width: 315px;
    min-height: 250px;
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
    cursor: default;
  }

  .main-card .grayscale-image {
    filter: none;
  }
}
</style>
