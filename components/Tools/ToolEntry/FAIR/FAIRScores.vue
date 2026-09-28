<template>
  <section
    v-if="fairsoft"
    id="fair-scores"
    class="fair-card"
    aria-labelledby="fair-title"
  >
    <h2 id="fair-title" class="fair-title">FAIRsoft scores</h2>
    <p class="fair-description">
      How well this software can be found, accessed, combined and reused.
    </p>

    <div
      v-for="(dimension, index) in FAIR_DIMENSIONS"
      :key="dimension.id"
      class="dimension"
      :class="{ 'dimension--open': isOpen(dimension.id) }"
    >
      <button
        type="button"
        class="dimension-row"
        :aria-expanded="isOpen(dimension.id)"
        :aria-controls="`fair-panel-${dimension.id}`"
        @click="toggle(dimension.id)"
      >
        <span class="dimension-name">{{ dimension.title }}</span>

        <span class="dimension-score">
          <span class="score-bar">
            <span class="score-bar-fill" :style="barStyle(dimension.id)" />
          </span>
          <span class="score-value">{{ percent(dimension.id) }}</span>
          <UIcon
            :name="isOpen(dimension.id) ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"
            class="size-4 text-gray-400"
          />
        </span>
      </button>

      <!-- Sub-indicadores. Este bloque es el que pasará a FAIRTreeView -->
      <div
        :id="`fair-panel-${dimension.id}`"
        class="sub-panel-wrapper"
        :class="{ 'sub-panel-wrapper--open': isOpen(dimension.id) }"
      >
        <div class="sub-panel">
          <div class="sub-panel-inner">
            <div v-for="child in dimension.children" :key="child.id" class="sub-row">
              <UIcon
                :name="childIcon(child.id)"
                class="sub-icon size-4"
                :style="{ color: childColor(child.id) }"
              />
              <span class="sub-name">{{ child.name }}</span>
              <span v-if="percent(child.id) !== null" class="sub-score">
                {{ percent(child.id) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="index < FAIR_DIMENSIONS.length - 1" class="dimension-divider" />
    </div>

    <div class="fair-footer">
      Based on available metadata (a low score may mean information is missing).
      <br />
      Indicator A2 is not currently measured.
      <br />
      <a
        href="https://inab.github.io/FAIRsoft_indicators/"
        target="_blank"
        rel="noopener noreferrer"
        class="fair-evaluator-link"
      >
        <UIcon name="i-mdi-tools" class="size-3 me-1" />
        Learn about the FAIRsoft indicators
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FAIR_DIMENSIONS,
  getRawScore,
  getStatus,
  scoreColor,
  statusColor,
  toPercent,
  type FairSoft,
  type FairStatus,
} from '@/utils/fairsoft.ts';

const props = defineProps<{
  fairsoft?: FairSoft | null;
}>();

// Nombres de icono como literales completos: Nuxt UI v2 resuelve los
// "i-*" con Tailwind en build, y un nombre construido en runtime no se detecta.
const STATUS_ICONS: Record<FairStatus, string> = {
  pass: 'i-mdi-check-circle',
  partial: 'i-mdi-circle-half-full',
  fail: 'i-mdi-close-circle',
};

// Acordeón: solo una dimensión abierta a la vez.
const openDimension = ref<string | null>(null);

const isOpen = (id: string) => openDimension.value === id;

function toggle(id: string) {
  openDimension.value = isOpen(id) ? null : id;
}

const raw = (key: string) => getRawScore(props.fairsoft, key);
const percent = (key: string) => toPercent(raw(key));

function barStyle(key: string) {
  return {
    width: `${percent(key) ?? 0}%`,
    backgroundColor: scoreColor(raw(key)),
  };
}

const childIcon = (key: string) => STATUS_ICONS[getStatus(raw(key))];
const childColor = (key: string) => statusColor(raw(key));
</script>

<style scoped>
.fair-card {
  width: 100%;
  max-width: 280px;
  background-color: #fff;
  padding: 1rem 1.1rem;
  position: sticky;
  top: 90px; /* ajústalo a la altura de tu header */
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.fair-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 87%);
}

.fair-description {
  font-size: 13px;
  color: rgba(0, 0, 0, 45%);
  margin: 0 0 14px;
  line-height: 1.5;
}

.dimension-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

.dimension-row:focus-visible {
  outline: 1px solid var(--bs-primary, #0b579f);
  border-radius: 4px;
}

.dimension-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 87%);
}

.dimension--open .dimension-name {
  font-weight: 500;
}

.dimension-score {
  display: flex;
  align-items: center;
}

.score-bar {
  display: block;
  width: 46px;
  height: 5px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 12%);
  overflow: hidden;
  margin-right: 8px;
}

.score-bar-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
}

.score-value {
  font-size: 14px;
  font-weight: 500;
  min-width: 24px;
  text-align: right;
}

.dimension-divider {
  border-top: 0.5px solid rgba(0, 0, 0, 12%);
}

/* Despliegue animado: sustituye a v-expand-transition de Vuetify */
.sub-panel-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}

.sub-panel-wrapper--open {
  grid-template-rows: 1fr;
}

.sub-panel {
  min-height: 0;
  overflow: hidden;
}

.sub-panel-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 10px;
  margin: 4px 0 8px;
}

.sub-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.sub-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.sub-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 70%);
  line-height: 1.35;
}

.sub-score {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 80%);
}

.fair-footer {
  border-top: 0.5px solid rgba(0, 0, 0, 12%);
  margin-top: 6px;
  padding-top: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 45%);
  line-height: 1.5;
}

.fair-evaluator-link {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--bs-primary, #0b579f);
  text-decoration: none;
}

.fair-evaluator-link:hover {
  text-decoration: underline;
}
</style>