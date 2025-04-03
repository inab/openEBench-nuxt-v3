<template>
  <div>
    <UModal v-model="dialogAppInstall" prevent-close :ui="{width:'w-96',overlay:{background:'bg-zinc-800/50'}}">
      <div class="px-4 py-3">
        <h6>{{ title }}</h6>
        <span class="text-xs text-slate-600" v-html="text" @click="handleLinkClick"></span><br>
        <!-- Buttons -->
          <UButton color="green" @click="openGitHubAppLink" class="mt-3 mr-2">
            Give Permissions 
            <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="sm" class="mx-1"/>
          </UButton>
         <UButton label="Close" class="" color="gray" variant="ghost" size="md" 
         :ui="{color:{gray:{ghost:'text-gray-900 hover:bg-gray-100'}},}" @click="cancelInstall" />
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed  } from 'vue';
import { useGithub } from '@/stores/observatory/evaluation/github';

// PROPS
const props = defineProps<{
  title: String,
  text: String,
  installationUrl: String,
  initialDialogAppInstall: boolean,
}>();

// GITHUB STORE
const githubStore = useGithub();
const importProgressText = computed(() => githubStore.getImportProgressText);
const repository = computed(() => githubStore.getRepository);

const handleLinkClick = (event: MouseEvent) => {
  const target = event.target as HTMLAnchorElement;
  if (target.tagName === 'A') {
    window.open(target.href, '_blank');
  }
};


// STATE
const dialogAppInstall = ref(props.initialDialogAppInstall);
const socket = ref(null);

watch(
  () => props.initialDialogAppInstall, // Watch for changes in the prop
  (newValue) => {
    dialogAppInstall.value = newValue; // Update local state
  }
);

const emit = defineEmits({
  cancel: null,
  ready: null,
});
const cancelInstall = () => {
  emit('cancel'); // Emit the 'cancel' event
};
const openGitHubAppLink = () => {
  /*
  This function is called when the user clicks on the "Install App" button in the dialog.
  It does two things:
  1. [NOT FOR NOW IN PRODUCTION] Opens a socket to listen for the installation ID. This socket:
      - Emits a "installation-requested" event to the server with the repo name and owner
      - Listens for a "new-installation" event from the server with the installation ID.
        This event is triggered by the server when the installation is complete.
      - When the event is received, it stores the installation ID in the store and
        triggers the metadata import.

  2. Opens the GitHub App installation page in a new window.
  */

	// 1. Open socket to listen for installation ID
  /*
  socket.value = this.$nuxtSocket({
    name: 'main'
  })
  */

  // 1.1. Emit event to server for it to listen for the installation ID
  // this.socket.emit('installation-requested', this.repository)

  // 1.2. When server sends the installation ID, store it in the store

  /*
  socket.value.on('new-installation', (installation_id) => {
    githubStore.updateInstallationID(installation_id);
    githubStore.updateDialogAppInstall(false) // close "app installation" dialog
    githubStore.updateDialogImportMetadata(true) // open "import metadata" dialog
  */
  // 1.3. Emit event to parent component to trigger metadata import or PR creation
	// emit('ready');

  // })

  // 2. Open App installation in new window
  window.open(
    'https://github.com/apps/metadata-extractor-for-fairsoft/installations/new',
    '_blank'
  );

}
</script>

<style scoped>
.modalAppInstall{
  max-width: 350px !important;
}
</style>