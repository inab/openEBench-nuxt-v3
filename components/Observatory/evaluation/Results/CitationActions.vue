<template>
  <div class="my-5 px-5">
    <div class="row">
      <h5>What is a Citation File?</h5>
      <p class="text-sm">
        A citation file helps ensure that your software gets proper citation
        when used in research. By including a citation file in your
        repository, users can easily reference your work. For more
        information, see the
        <a href="https://citation-file-format.github.io/" target="_blank"
          >Citation File Format CFF specification</a
        >.
      </p>
      <p class="text-sm">
        A CFF file has been generated based on the metadata provided in the
        previous step. Below, you have several options to preview, download,
        or directly integrate this file into your GitHub repository.
      </p>
      <p class="text-sm">
        Note that the authors are a required field of a CFF file. If you have
        not provided this information, the CFF file will not be generated.
        Additionally, please double-check that the given-names and
        family-names are correct, as this file was created automatically. Make
        any necessary adjustments to ensure accuracy.
      </p>
    </div>
  </div>

  <ViewCitation :citation="citation" />
  <ExportCitationCardDownload />
  <ExportContentCardPull :content="citation" type="citation" />

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import ViewCitation from '~/components/Observatory/evaluation/Export/ViewCitation.vue'
import ExportCitationCardDownload from '~/components/Observatory/evaluation/Export/ExportCitationCardDownload.vue'
import ExportContentCardPull from '~/components/Observatory/evaluation/Export/ExportContentCardPull.vue'

import { useMetadataStore } from '@/stores/observatory/evaluation/metadata';

const metadataStore = useMetadataStore();
const citation = computed(() => metadataStore.getToolMetadataCFF);

</script>