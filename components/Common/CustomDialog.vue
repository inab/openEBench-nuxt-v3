<template>
    <div v-if="isDialogOpen" class="dialog-mask">
        <div class="dialog-wrapper">
            <div class="dialog-container" ref="target">
                <div class="dialog-header">
                    <slot name="header">
                        Default Header
                    </slot>
                </div>
                <div class="dialog-body">
                    <slot name="content">
                        Default Content
                    </slot>
                </div>
                <div class="dialog-footer">
                    <slot name="footer">
                        <button 
                            @click.stop="emit('modal-close')">
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    isDialogOpen: boolean;
}>();

const emit = defineEmits(["modal-close"]);

const target = ref(null);


function dialogShow() {
    console.log('dialogShow');
}

</script>

<style scoped lang="scss">
.dialog-mask{
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}
.dialog-container {
    width: 300px;
    margin: 150px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    .dialog-header {
        font-size: 20px;
        font-weight: 500;
        color: #333;
        padding: 10px 0;
        border-bottom: 1px solid #e9e9e9;
    }
    .dialog-body {
        padding: 20px 0;    
    }
    .dialog-footer {
        text-align: right;
        padding: 10px 0;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        button {
            padding: 5px 15px;
            border: 1px solid #ccc;
            border-radius: 2px;
            background-color: #f9f9f9;
            cursor: pointer;
        }
    }
}
</style>