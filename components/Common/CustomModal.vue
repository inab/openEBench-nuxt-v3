<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <div class="modal-header">
          <slot name="header"> default header </slot>
        </div>
        <div class="modal-body">
          <slot name="content"> default content </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <div>
              <button @click.stop="emit('modal-close')">Close</button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  isOpen: Boolean,
  width: {
    type: String,
    default: "300px",
  },
});

const modalWith = `${props.width}px`;
const emit = defineEmits(["modal-close"]);
const target = ref(null);

onClickOutside(target, ()=>emit('modal-close'))

</script>
<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.modal-container {
  width: v-bind(modalWith);
  margin: 150px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-header {
  color: theme("colors.primary.500");
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid rgb(226, 232, 240);
  margin-bottom: 20px;
  .modal-title {
    font-size: 18px;
  }
  .modal-close {
    color: black;
    font-size: 22px;
  }
}

.modal-body {
  padding-bottom: 20px;
}
</style>
