<template>
  <div class="my-5 px-5">
    <div class="row">
      <h5>About the Metadata</h5>
      <p class="text-sm">
        The metadata provided here is based on the information provided in the
				previous step. It is in JSON-LD format and incorporates
        <a href="https://schema.org/" target="_blank">Schema.org</a>
        <a href="https://bioschemas.org/" target="_blank">Bioschemas</a>, and
        <a href="https://zbmed-semtec.github.io/maSMPs/" target="_blank"
					>maSMP</a
				>
        entities. This ensures your metadata is highly interoperable on the
        internet, making it easy to be understood and utilized by a wide range
        of systems and services. Additionally, this metadata can be used to
        pre-fill an
        <a href="https://osf.io/preprints/biohackrxiv/k8znb" target="_blank"
          >ELIXIR software management plan</a
        >
        for your software in the
        <a href="https://smw.dsw.elixir-europe.org/wizard/" target="_blank"
          >Software Management Wizard (SMW)</a
        >.
      </p>
      <p class="text-sm">
        Below, you have several options to preview, download, or directly
        integrate this file into your GitHub repository.
      </p>
    </div>
  </div>

  <ViewMetadata :key="metadata" :metadata="metadata" />
  <ExportMetadataCardDownload />
  <ExportContentCardPull :content="metadata" type="metadata"/>

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import ExportMetadataCardDownload from '~/components/Observatory/evaluation/Export/ExportMetadataCardDownload.vue'
import ExportContentCardPull from '~/components/Observatory/evaluation/Export/ExportContentCardPull.vue'
import ViewMetadata from '~/components/Observatory/evaluation/Export/ViewMetadata.vue'
import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();
const metadata = computed(() => metadataStore.getToolMetadataJSONLD);

</script>