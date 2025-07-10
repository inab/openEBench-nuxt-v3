<template>
  <div class="mb-0 pb-0 ml-auto mr-0 pr-0 pt-2">
    <UTooltip text="See iframe code" :ui="{
      background: 'bg-black bg-opacity-50', color: 'text-white',
      transition: {
        enterActiveClass: 'transition ease-out duration-300',
        leaveActiveClass: 'transition ease-in duration-150',
      }
    }">
      <button @click="dialog = true" class="px-2 rounded-full hover:bg-gray-100 click-animation"
        aria-label="Copy icon">
        <UIcon name="i-oui-copy" class="text-slate-300" />
      </button>
    </UTooltip>

    <div v-if="dialog"
      class="fixed z-30 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
      @click.self="closeDialog">
      <div :class="['relative mx-auto p-4 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white', dialogAnimation]">
        <h5 class="mb-2">Plots Iframe Code</h5>
        <p class="text-sm">
          Copy and paste the following code to embed the plots into your website. Change the width and
          height of the iframe as needed.
        </p>
        <div class="space-y-4">
          <div v-for="(item, index) in props.items" :key="index">
            <h6 class="text-sm text-primaryOeb-600">{{ item.title }}</h6>
            <div class="row">
              <div class="col-11">
                <pre class="bg-gray-100 p-2 rounded">
                  <div class="adjustable">{{ copyIframeCode(item.url) }}</div>
                </pre>
              </div>
              <div class="col-1">
                <UTooltip text="Copy to clipboard" :ui="{ background: 'bg-black bg-opacity-50', color: 'text-white' }">
                  <button @click="handleCopyClick(item.url)"
                    class="px-2 py-1 rounded-full hover:bg-gray-100 click-animation">
                    <UIcon name="i-oui-copy" class="text-gray-500" />
                  </button>
                </UTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="copied"
      class="fixed z-40 bottom-10 left-1/2 rounded transform -translate-x-1/2 w-80 text-center p-2 bg-black bg-opacity-50 text-white flex justify-between items-center">
      <span>Copied to clipboard</span>
      <button @click="copied = false" class="ml-2 bg-transparent border-none text-red-600">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  items: Array<{ title: string, url: string }>;
  currentCollection: string;
}>();

const dialog = ref(false);
const copied = ref(false);
const dialogAnimation = ref('an1');

const copyIframeCode = (url: string) => {
  const newUrl = `${url}/${props.currentCollection}/`;
  return `<iframe src="${newUrl}"
  frameborder="0"
  style="width:50%; height:500px;"
  scrolling="no">\n</iframe>`;
};

// Show message Copied to clipboard
const copyToClipboard = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    showCopiedMessage();
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

const showCopiedMessage = () => {
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 5000);
};

const handleCopyClick = (url: string) => {
  const code = copyIframeCode(url);
  copyToClipboard(code);
};

const closeDialog = () => {
  dialogAnimation.value = 'an2';
  setTimeout(() => {
    dialog.value = false;
    dialogAnimation.value = 'an1'; 
  }, 10); 
};

watch(dialog, (newValue) => {
  if (newValue) {
    dialogAnimation.value = 'an1';
  }
});
</script>

<style scoped>

.adjustable{
  padding-left: -10px;
}
.copy-icon {
  cursor: pointer;
  margin-top: -50px;
  margin-right: -30px;

}

.hover\:bg-gray-300:hover {
  background-color: #D1D5DB;
}

.click-animation {
  transition: transform 0.1s ease-in-out, background-color 0.1s ease-in-out;
}

.click-animation:active {
  transform: scale(0.98);
  background-color: #c6d8e9;
  border: 0.1px solid #084177;
}

.click-animation {
  background-color: initial;
}

.an1 {
  animation: animationup 0.5s ease 0s 1 normal forwards;
}

@keyframes animationup {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}

.an2 {
  animation: animationDown 0.5s ease 0s 1 normal forwards;
}

@keyframes animationDown {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>
