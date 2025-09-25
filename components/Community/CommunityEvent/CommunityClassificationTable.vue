<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Hello World</h2>

    <div
      v-for="(table, index) in computedTables"
      :key="index"
      class="oeb-table border rounded-lg p-4 shadow-sm mb-4"
      :id="table.divId"
      :data-benchmarkingevent="table.dataId"
    >
      <!-- Dropdown de clasificación -->
      <label :for="table.divId + '_bench_dropdown_list'">
        Classification Method:
      </label>
      <select
        :id="table.divId + '_bench_dropdown_list'"
        v-model="classifiers[table.divId]"
        class="classificator_list"
        @change="onClassifierChange(table.divId)"
      >
        <optgroup label="Select a classification method:">
          <option value="squares">SQUARE QUARTILES</option>
          <option value="diagonals">DIAGONAL QUARTILES</option>
          <option value="clusters">K-MEANS CLUSTERING</option>
        </optgroup>

      </select>

      <!-- Spinner -->
      <div v-if="loading[table.divId]" 
        class="spinner-container flex justify-center items-center">
        <img
          :src="loaderImage"
          loading="lazy"
          class="spinner w-8 h-8"
          alt="Loading..."
        />
      </div>

      <div v-else id="table-content-{{ table.divId }}">
        <!-- Error message -->
        <p v-if="errors[table.divId]" class="text-red-500">{{ errors[table.divId] }}</p>

        <!-- Tabs -->
        <div v-if="tableData && tableData.aggregation_slices.length > 0" class="mb-3 mt-4">
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="(slice, idx) in paginatedSlices"
              :key="idx"
              @click="activeSliceIndex = currentPage * tabsPerPage + idx"
              class="px-3 py-1 rounded-lg border texto-truncado"
              :class="activeSliceIndex === (currentPage * tabsPerPage + idx)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              {{ slice.from }}
              <span v-if="slice.from !== slice.to">→ {{ slice.to }}</span>
            </button>
          </div>

          <!-- Paginador -->
          <div class="flex justify-center mt-2 space-x-2">
            <button
              @click="currentPage = Math.max(currentPage - 1, 0)"
              :disabled="currentPage === 0"
              class="px-2 py-1 border rounded disabled:opacity-50"
            >
              ◀ Prev
            </button>
            <!--  -->
            <button
              @click="currentPage = Math.min(currentPage + 1, totalPages - 1)"
              :disabled="currentPage === totalPages - 1"
              class="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
        </div>

        <div v-if="tableData">

          <!-- Reporte -->
          <div class="flex flex-row justify-between">
            <p class="text-sm font-semibold">
              {{ tableData.challenges_list.length }} Challenges,
              {{ tableData.num_charts }} charts
            </p>
            <div v-if="paginationInfo" class="text-sm text-gray-600">
              {{ paginationInfo.start }}–{{ paginationInfo.end }} tabs of {{ paginationInfo.totalTabs }} tabs, 
              {{ paginationInfo.currentPage }}/{{ paginationInfo.totalPages }} pages
            </div>
          </div>
          
          <!-- Tabla -->
          <div v-if="tableData.aggregation_slices[activeSliceIndex]">

            <!-- Table container -->
            <div class="overflow-x-auto overflow-y-auto max-h-[50vh]">

              <table class="table-auto w-full min-w-64 border-separate border-spacing-0 oeb-table">
                <thead class="sticky z-20 top-0 bg-white">
                  <tr>
                    <th class="border px-2 py-1 text-center font-bold sticky left-0 z-30 bg-white">
                      Challenges →
                    </th>
                    <th
                      v-for="(ch, i) in tableData.challengeHeaders.filter(h => tableData.aggregation_slices[activeSliceIndex].members.some(m => m._id === h.id))"
                      :key="i"
                      class="border px-2 py-1 text-center font-bold"
                      :colspan="ch.colspan"
                    >
                      <a
                        :href="ch.url"
                        target="_blank"
                        class="text-blue-600 hover:underline"
                        :title="ch.acronym"
                      >
                        {{ ch.acronym }}
                      </a>
                    </th>
                  </tr>
                  <tr>
                    <th class="border px-2 py-1 font-bold text-center sticky left-0 z-30 bg-white">
                      Charts → <br />
                      Participants ↓
                    </th>
                    <th
                      v-for="(aggregation, i) in tableData.aggregation_slices[activeSliceIndex].members" :key="i"
                      class="border px-2 py-1 text-center"
                    >
                      <div>
                        <template v-if="aggregation.metrics && aggregation.metrics.length">
                          <template v-for="(m, idx) in aggregation.metrics" :key="idx">
                            <span>{{ m?.title ?? 'undefined' }}</span>
                            <template v-if="idx < aggregation.metrics.length - 1">
                              <br>
                              <span class="font-normal">vs</span>
                              <br>
                            </template>
                          </template>
                        </template>
                        <template v-else>
                          undefined
                        </template>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="tool in tableData.ordered_tools" :key="tool">

                    <!-- Tool column -->
                    <td class="border px-2 py-1.5 font-semibold sticky left-0 z-10 bg-white min-w-44">
                      <div class="aggregation_cell">
                        <a
                          v-if="tableData.toolElixirIds[tool]"
                          :href="`https://${props.mode}.bsc.es/tool/${tableData.toolElixirIds[tool]}`"
                          target="_blank"
                          class="aggregation_cell_2"
                          
                        >
                          {{ tool }}
                        </a>
                        <span v-else class="text-black cursor-default" :title="tool">
                          {{ tool }}
                        </span>
                      </div>
                    </td>
                    <td
                      v-for="(aggregation, i) in tableData.aggregation_slices[activeSliceIndex].members"
                      :key="i"
                      class="border px-2 py-1.5 text-center"
                      :class="aggregation.participants[tool] ? 'Q' + aggregation.participants[tool] : ''"
                    >
                      {{ aggregation.participants[tool] ? 'Q' + aggregation.participants[tool] : '-' }}
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { loaderImage } from '@/assets/loader/loaderImage.js'
const props = defineProps({
  challengeList: { type: Array, default: () => [] },
  activeTable: { type: String, default: null },
  tables: { type: Array, default: () => [] },
  apiUrl: { type: String, default: 'https://openebench.bsc.es/rest/api' },
  benchEventApiUrl: { type: String, default: 'https://openebench.bsc.es/rest/bench_event_api' },
  mode: { type: String, default: 'openebench' }
})

const tableData = ref(null)
// Guardamos qué clasificador está seleccionado por tabla
const classifiers = ref({})
const loading = ref({})
const errors = ref({})
const results = ref({})

// Paginador
const activeSliceIndex = ref(0)
const tabsPerPage = 10          
const currentPage = ref(0)


// COMPUTAMOS LAS TABLAS
const computedTables = computed(() => {
  if (props.challengeList.length === 0 && props.activeTable === null) {
    return props.tables.map((dataId) => ({
      dataId,
      divId: dataId.replace(':', '_')
    }))
  } else {
    return [
      {
        dataId: props.activeTable,
        divId: props.activeTable.replace(':', '_')
      }
    ]
  }
})

// 👉 función que sustituye load_table
function load_table(divId, challengeList, classifier = 'diagonals', chunkSize = 10) {
  // inicializamos el clasificador si no está
  if (!classifiers.value[divId]) {
    classifiers.value[divId] = classifier
  }

  // ejecutar clasificación inicial
  compute_classification(divId, classifiers.value[divId], challengeList, chunkSize)
}

// Manejo cuando cambia el dropdown
function onClassifierChange(divId, chunkSize = 10) {
  compute_classification(divId, classifiers.value[divId], props.challengeList, chunkSize)
}

function setLoading(divId, isLoading) {
  loading.value[divId] = isLoading
}

// Revisar bien esta funcion.
function prepareTableData(
  aggregations,
  chunk_size,
  mode,
  community_id
) {
  let known_tools = {}
  let ordered_tools = []
  let challenges = {}
  let challenges_list = []
  let num_charts = 0

  aggregations.forEach((aggregation) => {
    if ('participants' in aggregation) {
      // Append columns with aggregations and results
      Object.keys(aggregation.participants).forEach((toolname) => {
        if (!(toolname in known_tools)) {
          known_tools[toolname] = true
          ordered_tools.push(toolname)
        }
      })
      if (!(aggregation._id in challenges)) {
        challenges[aggregation._id] = []
        challenges_list.push(challenges[aggregation._id])
      }
      challenges[aggregation._id].push(aggregation)
      if (Object.keys(aggregation.participants).length > 0) {
        num_charts++
      }

      // ------------------------------------------------------------
      // Aggregation specific cell

      if (aggregation.aggregation_id !== undefined){
        aggregation.metrics.forEach((m_entry, m_entry_i) => {
          if (m_entry == null) {
            // console.log("FIXME: metrics label not in challenge", aggregation);
          }
        })
      }
    }
  })

  challenges_list.sort((a, b) => {
    const c_a = a[0].challenge_acronym.toUpperCase()
    const c_b = b[0].challenge_acronym.toUpperCase()
    return c_a < c_b ? -1 : c_a > c_b ? 1 : 0
  })

  let empty_challenges_list = []
  let used_challenges_list = []
  challenges_list.forEach((aggregations) => {
    let challenge_num_charts = aggregations
      .map((aggregation) => Object.keys(aggregation.participants).length)
      .reduce((ps, a) => ps + a, 0)
    if (challenge_num_charts > 0) {
      used_challenges_list.push(aggregations)
    } else {
      empty_challenges_list.push(aggregations)
    }
  })

  let force_break = false
  const reduce_lambda = (aggregation_slices, aggregations) => {
    let lastidx = aggregation_slices.length - 1
    if (
      lastidx == -1 ||
      aggregation_slices[lastidx].members.length + aggregations.length >= chunk_size ||
      force_break
    ) {
      force_break = false
      let aggregation_tab = {
        from: aggregations[0].challenge_acronym,
        to: aggregations[0].challenge_acronym,
        members: [...aggregations],
        empty_challenge: Object.keys(aggregations[0].participants).length === 0
      }
      aggregation_slices.push(aggregation_tab)
    } else {
      let aggregation_tab = aggregation_slices[lastidx]
      aggregation_tab.members.push(...aggregations)
      aggregation_tab.to = aggregations[0].challenge_acronym
    }
    return aggregation_slices
  }

  let aggregation_slices = used_challenges_list.reduce(reduce_lambda, [])
  force_break = true
  aggregation_slices = empty_challenges_list.reduce(reduce_lambda, aggregation_slices)

  // 🔹 Construir headers con colspan y URL
  const challengeHeaders = []
  const seen = {}
  challenges_list.flat().forEach(agg => {
    if (!seen[agg._id]) {
      seen[agg._id] = {
        id: agg._id,
        acronym: agg.challenge_acronym ?? agg.acronym,
        url: `https://${mode}.bsc.es/scientific/${community_id}/${agg._id}`,
        colspan: 1
      }
      challengeHeaders.push(seen[agg._id])
    } else {
      seen[agg._id].colspan++
    }
  })

  return {
    ordered_tools,
    challenges_list,
    num_charts,
    aggregation_slices,
    challengeHeaders 
  }
}

// ------------------------------------------------------------------------------------------------
// PAGINADOR
// ------------------------------------------------------------------------------------------------
// calcular slices visibles en la página actual
const paginatedSlices = computed(() => {
  if (!tableData.value) return []
  const start = currentPage.value * tabsPerPage
  return tableData.value.aggregation_slices.slice(start, start + tabsPerPage)
})

// total de páginas
const totalPages = computed(() => {
  if (!tableData.value) return 0
  return Math.ceil(tableData.value.aggregation_slices.length / tabsPerPage)
})

const paginationInfo = computed(() => {
  if (!tableData.value) return null

  const totalTabs = tableData.value.aggregation_slices.length
  const start = currentPage.value * tabsPerPage + 1
  const end = Math.min((currentPage.value + 1) * tabsPerPage, totalTabs)
  const totalPages = Math.ceil(totalTabs / tabsPerPage)

  return {
    start,
    end,
    totalTabs,
    currentPage: currentPage.value + 1,
    totalPages
  }
})



// ------------------------------------------------------------------------------------------------
// Adaptación de compute_classification
async function compute_classification(divId, selectedClassifier, challengeList, chunkSize) {
  setLoading(divId, true)
  errors.value[divId] = null
  results.value[divId] = null

  try {
    const api_url = props.apiUrl
    const bench_event_api_url = props.benchEventApiUrl
    const mode = props.mode

    const pathData = `${divId}/${selectedClassifier}`
    const url = `${bench_event_api_url.replace(/\/$/, '')}/${pathData}`

    const method = (challengeList.length === 0 ? 'GET' : 'POST')

    // 🔹 Aquí $fetch ya devuelve el JSON, no un Response
    const resultsJson = await $fetch(url, {
      method,
      body: method === 'POST' ? challengeList : undefined
    })

    if (!resultsJson || resultsJson.length === 0 || resultsJson.data === null) {
      errors.value[divId] = `No data available for benchmarking event: '${divId}'`
      return
    }

    // 🔹 Calcular bench_id y community_id
    const bench_id = divId
    const community_id = "OEBC" + bench_id.substring(4, 7)

    const graphqlUrl = api_url
      ? api_url
      : `https://${mode}.bsc.es/sciapi/graphql`


    const gqlResponse = await $fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        query: `
          query getTools($community_id: String!) {
            getTools(toolFilters: { community_id: $community_id }) {
              registry_tool_id
              name
            }
          }
        `,
        variables: { community_id }
      }
    })

    const toolList = gqlResponse?.data?.getTools ?? []

    // 🔹 Generar diccionario tool_elixir_ids
    const tool_elixir_ids = {}
    toolList.forEach(tool => {
      if (tool.registry_tool_id != null) {
        tool_elixir_ids[tool.name] = tool.registry_tool_id.split(':')[1].toLowerCase()
      } else {
        tool_elixir_ids[tool.name] = null
      }
    })

    // 
    // 
    // 
    // 🔹 Llamar a fill_in_table (placeholder por ahora)
    // fill_in_table(divId, resultsJson, mode, tool_elixir_ids, community_id, bench_id, chunkSize, api_url)
    console.log('📊 fill_in_table pendiente', {
      divId, resultsJson, mode, tool_elixir_ids, community_id, bench_id, chunkSize, api_url
    })

    const prepared = prepareTableData(resultsJson, chunkSize, mode, community_id)
    prepared.toolElixirIds = tool_elixir_ids
    tableData.value = prepared

    // Guardar resultados
    results.value[divId] = resultsJson
  } catch (err) {
    console.error('❌ Error en compute_classification:', err)
    errors.value[divId] = 'Unexpected error while fetching data.'
  } finally {
    setLoading(divId, false)
  }
}

// ------------------------------------------------------------------------------------------------
// Montaje inicial
// ------------------------------------------------------------------------------------------------
onMounted(() => {
  computedTables.value.forEach((table) => {
    load_table(table.divId, props.challengeList)
  })
})

// Volvemos a calcular si cambian las props
watch([() => props.challengeList, () => props.activeTable], () => {
  computedTables.value.forEach((table) => {
    load_table(table.divId, props.challengeList)
  })
})
</script>

<style scoped>

.classificator_list {
  background-color: #0a58a2;
  color: #fff;
  cursor: pointer;
  padding-left: 5px;
  padding-right: 25px;
  margin-left: 50px;
  text-align: center;
  border: 5px solid transparent;
  border-right: 15px solid transparent;
  line-height: 1.25rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
}

.classificator_list:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(61 121 179 / var(--tw-bg-opacity));
}

select.classificator_list {
  appearance: auto;
  -moz-appearance: auto !important;
  -webkit-appearance: auto !important;
}
/* Cells color */
.Q1 {
  background-color: #238b45;
  color: #ffffff;
}

.Q2 {
  background-color: #74c575;
}

.Q3 {
  background-color: #bbe4b3;
}

.Q4 {
  background-color: #edf8e9;
}

.texto-truncado {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 150px;
  max-width: 30ch;
}

.oeb-table th,
.oeb-table {
  background: #fff;
}

.oeb-table thead th {
  z-index: 20;
  position: sticky;
  top: 0;
}

/* Fijar las dos primeras celdas del thead en el scroll horizontal */
.oeb-table thead th.sticky {
  left: 0;
  z-index: 30; /* más alto que el resto del header */
  background: #fff;
  position: sticky;
}


</style>