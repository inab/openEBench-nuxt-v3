<template>
  <div>
    <!-- Main Content -->
    <div class="content p-4">
      <div class="row my-4">
        <div class="col-8">
          <h3 class="fw-bold">FAIRsoft Indicator Scoreboard</h3>

          <!-- <p style="line-height: 1.9" class="mb-0 mt-0">
            This page brings to light the <strong>collective insights</strong>
            from our FAIRsoft indicators, providing a clear snapshot of trends and scores across various software.
            <br>
          </p>
          <p style="line-height: 1.5" class="mb-0 mt-0">
            <strong>Deep Dive:</strong>
            Each FAIRsoft indicator is explained in detail
            <a href="https://inab.github.io/FAIRsoft_indicators/" target="_blank">here.</a>
          </p> -->

        </div>
        <!-- Alert -->
        <!-- <div class="col-4">
          <UAlert v-if="showAlert" :close-button="closeButtonOptions" @close="handleClose" color="sky" variant="soft"
            :ui="{ shadow: 'shadow-md', padding: 'p-3', gap: 'gap-0' }">
            <template #description>
              <span class="text-black"><b>Looking for a personalized analysis? 🤔</b></span><br>
              <span class="text-slate-900 text-xs">
                Head over to the
                <button @click="goToEvaluatorTab" class="text-primary-500 underline">
                  <strong>FAIRsoft Evaluator</strong>
                </button>, where you can assess individual tools and really drill down into the specifics.
              </span>
            </template>
          </UAlert>
        </div> -->

      </div>
      <!-- collectionSelector -->
      <div class="row mt-4">
        <div class="col-2"></div>
        <div class="col-8">
          <collectionSelector />
        </div>
        <div class="col-2"></div>
      </div>

      <!-- New Text -->
      <p class="mb-5 mt-4 mx-5 text-sm">
        This scoreboard provides a visual summary of FAIRness scores for research software, based on the FAIRsoft indicators. 
        Explore how different software collections perform across the four FAIR dimensions: Findable, Accessible, Interoperable, and Reusable.
      </p>

      <!-- Accordion - How to read this page -->
      <div class="px-5 ">
        <UAccordion color="white" variant="ghost" class="" :items="items" :ui="{ wrapper: 'flex flex-col w-full' }">
          <template #item="{ item }">
            <div class="mx-2.5 border-t border-gray-200 dark:border-gray-700">
              <ul class="list-disc pl-5 space-y-2 text-xs mt-2 text-slate-800">
                <li><strong>FAIR Dimensions:</strong> The page is structured around the four FAIR principles. Each one has associated indicators (e.g., “F1” for Identity Uniqueness).</li>
                <li><strong>Size of bubbles:</strong> Indicates the percentage of tools that meet the indicator.</li>
                <li><strong>Color coding:</strong> When you select a collection, its scores are shown in color, while the scores of all tools in the database appear in light grey — making it easy to compare your community with the overall landscape.</li>
                <li><strong>Want to go deeper?</strong> Use the <a href="https://openebench.bsc.es/observatory/Evaluation" class="text-primary underline" target="_blank">FAIRsoft Evaluator</a>to analyze a specific software or get improvement suggestions.</li>
              </ul>
            </div>
          </template>
        </UAccordion>
      </div>

      <!-- Tabs -->
      <div class="px-5 mt-4">
        <div class="d-flex gap-2 mb-4 flex justify-center space-x-5">
          <UButton  v-for="tab in tabs"
            :key="tab.id" 
            @click="activeTab = tab.id"
            :ui="{ rounded: 'rounded-full' }"
            variant="outline"
            size="lg"
            :class="activeTab === tab.id ? 'bg-primaryOeb-50' : 'bg-white'"
          >
            {{ tab.label }}
          </UButton>
        </div>
      </div>
      
      <!-- Plots -->
      <div class="row justify-center mt-4">
        <!-- 1 -->
        <div class="col-12" v-if="activeTab === 'tab1'">
          <div
            class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <PlotWOptions class="copy-icon" :items="dialogItemsFindability" :currentCollection="current_collection" />
            <h6 class="text-center mt-4 text-2xl font-semibold">
              Findability
            </h6>
            <p class="m-4 text-sm text-center">
              Findability refers to how easily software and its metadata can be
							discovered by both humans and machines. It ensures that users can
							identify, locate, and reference a tool reliably.
            </p>
            <div class="row">
              <div class="col-12">
                <!-- Loader -->
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <!-- Plot -->
                <BubbleChart v-else div_id="findability" :collection="current_collection"
                  :collection_scores="fair_scores.F.fair_scores" :indicators_labels="fair_scores.F.labels"
                  :control_scores="control_fair_scores.F.fair_scores" :collection_colors="colors"
                  :collection_colors_lines="colors_lines" />
              </div>
            </div>

            <!-- New info -->
            <UDivider/>
            <div class="mt-4 text-sm">
              <ul class="list-disc row">
                <div class="col-6">
                  <li class="mb-2">
                    <strong class="blue_marker">F1 – Identity uniqueness</strong>
                    <br/>
                    <strong
                      >Does the software have a persistent and unique
                      identifier?</strong
                    >
                    <ul class="list-circle">
                      <li lc>
                        The software has a name that clearly distinguishes it from
                        others.
                      </li>
                      <li>
                        Software versions are clearly labelled (e.g., 1.0, 2.1).
                      </li>
                    </ul>
                  </li>
                  <li class="mb-2">
                    <strong class="orange_marker"
                      >F2 – Existence of metadata</strong
                    >
                    <br />
                    <strong
                      >Is the software described with rich, structured
                      metadata?</strong
                    >
                    <ul class="list-circle">
                      <li>
                        Metadata is in machine-readable formats like JSON, XML, or
                        YAML.
                      </li>
                      <li>
                        Metadata uses community standards (e.g., EDAM,
                        Bioschemas).
                      </li>
                    </ul>
                  </li>
                </div>
                <div class="col-6">
                  <li>
                    <strong class="green_marker">F3 – Discoverability</strong>
                    <br />
                    <strong
                      >Can the software be found using external resources?
                    </strong>
                    <ul class="list-circle">
                      <li>
                        The software is listed in curated registries like
                        bio.tools.
                      </li>
                      <li>
                        The software is available in code repositories such as
                        GitHub or GitLab.
                      </li>
                      <li>
                        The software is described in a peer-reviewed publication
                        or preprint.
                      </li>
                    </ul>
                  </li>
                </div>
							</ul>
            </div>
          </div>
        </div>

        <!-- 2 -->
        <div class="col-12" v-if="activeTab === 'tab2'">
          <div
            class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <PlotWOptions class="copy-icon" :items="dialogItemsAccessibility" :currentCollection="current_collection" />
            <h6 class="text-center mt-4 text-2xl font-semibold"> Accessibility </h6>
            <p class="m-4 text-sm text-center">
              Accessibility evaluates whether users can obtain, install, and
							run the software without barriers.
            </p>
            <div class="row">
              <div class="col-12">
                <!-- Loader -->
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <!-- Plot -->
                <BubbleChart v-else div_id="accessibility" :collection="current_collection"
                  :collection_scores="fair_scores.A.fair_scores" :indicators_labels="fair_scores.A.labels"
                  :control_scores="control_fair_scores.A.fair_scores" :collection_colors="colors"
                  :collection_colors_lines="colors_lines" />
              </div>
            </div>

            <!-- New info -->
            <UDivider/>
            <div class="mt-4 text-sm">
              <ul class="list-disc row">
                <div class="col-6">
                  <li class="mb-2">
                    <strong class="blue_marker"
                      >A1 – Availability of working version</strong
                    >
                    <br />
                    <strong
                      >Can users access or install a working version of the
                      software?</strong
                    >
                    <ul class="list-circle">
                      <li>
                        The software can be accessed through a web service or API.
                      </li>
                      <li>
                        A version can be downloaded and run locally or via
                        containers.
                      </li>
                      <li>
                        Clear instructions are provided for building or installing
                        the software.
                      </li>
                      <li>
                        Sample input/output data is available for testing the
                        tool.
                      </li>
                      <li>
                        The source code is openly accessible for download and
                        compilation.
                      </li>
                    </ul>
                  </li>
                </div>
                <div class="col-6">
                  <li>
                    <strong class="orange_marker"
                      >A3 – Unrestricted Access</strong
                    >
                    <br />
                    <strong>Can the software be used without barriers? </strong>
                    <ul class="list-circle">
                      <li>The software works on free OSes like GNU/Linux.</li>
                      <li>
                        The software runs on at least two operating systems.
                      </li>
                      <li>
                        The software can be accessed via public platforms (e.g.
                        Galaxy, VREs).
                      </li>
                      <li>
                        The software is usable across more than one
                        e-infrastructure.
                      </li>
                    </ul>
                  </li>
                </div>
							</ul>
            </div>
          </div>
        </div>

        <!-- 3 -->
        <div class="col-12" v-if="activeTab === 'tab3'">
          <div
            class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <PlotWOptions class="copy-icon" :items="dialogItemsInteroperability"
              :currentCollection="current_collection" />
            <h6 class="text-center mt-4 text-2xl font-semibold"> Interoperability </h6>
            <p class="m-4 text-sm text-center">
              Interoperability assesses whether the software can work smoothly
							with other tools, data formats, and platforms.
            </p>
            <div class="row">
              <div class="col-12">
                <!-- Loader -->
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <!-- Plot -->
                <BubbleChart v-else div_id="interoperability" :collection="current_collection"
                  :collection_scores="fair_scores.I.fair_scores" :indicators_labels="fair_scores.I.labels"
                  :control_scores="control_fair_scores.I.fair_scores" :collection_colors="colors"
                  :collection_colors_lines="colors_lines" />
              </div>
            </div>

            <!-- New info -->
            <UDivider/>
            <div class="mt-3 text-sm">
              <ul class="list-disc row">
                <div class="col-6">
                  <li class="mb-2">
                    <strong class="blue_marker"
                      >I1 – Data format standards and practices</strong
                    >: <br />
                    <strong>
                      Does the software use and support standard data formats and
                      good data handling practices?</strong
                    >
                    <ul class="list-circle">
                      <li>
                        Input/output formats follow accepted standards (e.g., EDAM
                        ontology).
                      </li>
                      <li>
                        Input/output formats can be validated using schemas (e.g.,
                        JSON, XML, RDF).
                      </li>
                      <li>
                        Multiple input/output formats are supported or
                        convertible.
                      </li>
                    </ul>
                  </li>
                </div>
                <div class="col-6">
                  <li class="mb-2">
                    <strong class="orange_marker"
                      >I2 – Software integration</strong
                    >
                    <br />
                    <strong
                      >Can the software be used easily with other tools or in
                      workflows?</strong
                    >
                    <ul class="list-circle">
                      <li>
                        The software is available as a library or has an API
                        version.
                      </li>
                      <li>
                        The software can be deployed on platforms like Galaxy or
                        VREs.
                      </li>
                    </ul>
                  </li>
                </div>
								<li>
									<strong class="green_marker"
										>I3 – Dependencies availability</strong
									>
									<br />
									<strong
										>Are the software’s dependencies documented and
										accessible?</strong
									>
									<ul class="list-circle">
										<li>The software explicitly lists its dependencies.</li>
										<li>
											Dependencies are bundled or accessible through external
											resources.
										</li>
										<li>
											The software is available through systems like Bioconda or
											Galaxy Europe.
										</li>
									</ul>
								</li>
							</ul>
            </div>
          </div>
        </div>

        <!-- 4 -->
        <div class="col-12" v-if="activeTab === 'tab4'">
          <div
            class="my-4 p-4 max-full bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <PlotWOptions class="copy-icon" :items="dialogItemsReusability" :currentCollection="current_collection" />
            <h6 class="text-center mt-4 text-2xl font-semibold"> Reusability </h6>
            <p class="m-4 text-sm text-center">
              Reusability evaluates whether the software is well-documented,
							legally usable, and maintained in a way that supports future use.
            </p>
            <div class="row">
              <div class="col-12">
                <!-- Loader -->
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-52 mb-3 mx-10" />
                <USkeleton v-if="storeFairness.unLoaded.FAIRscores" class="h-7 w-80 rounded-xl mb-5 mx-10" />
                <!-- Plot -->
                <BubbleChart v-else div_id="reusability" :collection="current_collection"
                  :collection_scores="fair_scores.R.fair_scores" :indicators_labels="fair_scores.R.labels"
                  :control_scores="control_fair_scores.R.fair_scores" :collection_colors="colors"
                  :collection_colors_lines="colors_lines" />
              </div>
            </div>

            <!-- New info -->
            <UDivider/>
            <div class="mt-3 text-sm">
              <ul class="list-disc row">
                <div class="col-6">
                  <li class="mb-2">
                    <strong class="blue_marker">R1 – Usage Documentation</strong>
                    <br />
                    <strong
                      >Does the software provide documentation to help users
                      understand and apply it effectively?
                    </strong>

                    <ul class="list-circle">
                      <li>
                        User manuals or tutorials explain how to use the software.
                      </li>
                      <!--li>
                        Real use cases or examples illustrate practical
                        application.
                      </li-->
                    </ul>
                  </li>
                  <li class="mb-2">
                    <strong class="orange_marker">R2 – License</strong>
                    <br />
                    <strong
                      >Are there clear legal conditions for using the
                      software?</strong
                    >
                    <ul class="list-circle">
                      <li>
                        The software includes a stated license or terms of use.
                      </li>
                      <li>
                        Installation and usage conditions are clearly described.
                      </li>
                    </ul>
                  </li>
                </div>
                <div class="col-6">
                  <li class="mb-2">
                    <strong class="green_marker"
                      >R3 – Recognition and governance</strong
                    >
                    <br />
                    <strong
                      >Are contributor roles acknowledged and policies
                      defined?</strong
                    >
                    <ul class="list-circle">
                      <!--li>
                        Guidelines for external contributions are documented.
                      </li-->
                      <li>
                        Developers and contributors receive appropriate
                        recognition.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong class="purple_marker"
                      >R4 – Versioning and historical traceability</strong
                    ><br />
                    <strong
                      >Does the software follow version control and track changes
                      over time?</strong
                    >
                    <ul class="list-circle">
                      <li>
                        The software uses systems like Git to track changes.
                      </li>
                      <!--li>
                        There is a documented policy describing how and when new
                        versions are released.
                      </li>
                      <li>
                        Metadata for older versions is maintained in repositories.
                      </li-->
                    </ul>
                  </li>
                </div>
							</ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFairness } from '@/stores/observatory/fairness';
import { useObservatory } from '@/stores/observatory/index.js';
import collectionSelector from "@/components/Observatory/CollectionSelector.vue";
import BubbleChart from "./BubbleChart.vue";
import PlotWOptions from '@/components/Observatory/PlotWOptions.vue';
import { embedCodes } from '@/components/Observatory/visualizations/embedCodes.js';
import { activeTabIndex } from '@/components/Common/state.js';


// Store Data
const storeFairness = useFairness();
const observatoryStore = useObservatory();

// Fetch Data on Mount
onMounted(async () => {
  await storeFairness.getFAIRscores();
  await storeFairness.getControlFAIRscores();
});

const items = [{
  label: 'How to read this page',
  icon: 'i-material-symbols-info-rounded',
  defaultOpen: false,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
},]

const tabs = [
  { id: 'tab1', label: 'Findability' },
  { id: 'tab2', label: 'Accessibility' },
  { id: 'tab3', label: 'Interoperability' },
  { id: 'tab4', label: 'Reusability' }
]

const activeTab = ref('tab1')

// Constants
const dialogItemsFindability = [embedCodes.findabilityBubble];
const dialogItemsAccessibility = [embedCodes.accessibilityBubble];
const dialogItemsInteroperability = [embedCodes.interoperabilityBubble];
const dialogItemsReusability = [embedCodes.reusabilityBubble];

const fair_scores = computed(() => storeFairness.fairScores);
const control_fair_scores = computed(() => storeFairness.controlFAIRscores);
const current_collection = computed(() => observatoryStore.currentCollection);
const colors = ['#5da4d6', '#ff900e', '#2ca065', '#bd86f0'];
const colors_lines = ['#0075c7', '#995302', '#046b37', '#5e3d7d'];

// Alert state and handler
const showAlert = ref(true);
const closeButtonOptions = { icon: 'i-heroicons-x-circle-16-solid', color: 'gray', variant: 'link', padded: false };

function handleClose() {
  showAlert.value = false;
}


function goToEvaluatorTab() {
  activeTabIndex.value = 2;
}
</script>

<style scoped>


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.content {
  margin-top: 20px;
}

.copy-icon {
  float: inline-end;
  margin-top: -23px;
  margin-right: -20px;
}

a {
  color: #0b579f;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #6a98c4;
}

.new-color{
  color: #6b7280 !important;
}

.green_marker {
	color: #169454;
}

.orange_marker {
	color: #eb8510;
}

.blue_marker {
	color: #027bd1;
}

.purple_marker {
	color: #944fd3;
}

.list-circle{
  list-style:circle;
}
</style>
