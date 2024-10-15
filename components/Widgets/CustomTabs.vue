<template>
  <div class="custom-tabs">
    <!-- Participants -->
    <div class="custom-tabs__table">
      <table>
        <tbody>
          <tr v-for="row in paginatedData" :key="row[0]?.key">
            <td v-for="(item, index) in row" :key="index" class="custom-tabs-item">
              <!-- Show Tooltip only if item.name is longer than 25 characters -->
              <template v-if="item.name.length > 25">
                <UTooltip 
                  :text="formatName(item.name, 'tooltip')" 
                  :popper="{ offsetDistance: 16 }"
                  :ui="{ background: 'bg-primaryOeb-500', color: 'text-white', width: 'w-auto' }"
                >
                  <button
                    class="custom-tabs-button truncate"
                    :class="{ 'custom-tabs-button--active': item.key == selected.key }"
                    @click="selected = item"
                  >
                    {{ formatName(item.label) ? formatName(item.label) : formatName(item.name) }}
                  </button>
                </UTooltip>
              </template>

              <!-- If the item.name is less than 25 characters, do not display the Tooltip. -->
              <template v-else>
                <button
                  class="custom-tabs-button truncate"
                  :class="{ 'custom-tabs-button--active': item.key == selected.key }"
                  @click="selected = item"
                >
                  {{ formatName(item.label) ? formatName(item.label) : formatName(item.name) }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginator -->
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      v-if="props.data.length > itemsPerPage"
    >
      <UPagination
        v-model="currentPage"
        :page-count="itemsPerPage"
        :total="props.data.length"
      />
    </div>

    <!-- Widgets -->
    <div class="custom-tabs-content mt-4">
      <div
        v-for="(item, index) in props.data"
        :key="index"
        :class="[item.key == selected.key ? 'visible' : 'no-visible']"
      >
        <div>
          <LoaderChartWidgets :data="item" :metrics="props.metrics" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import LoaderChartWidgets from "@/components/Widgets/LoaderChartWidgets.vue";
import { ref, computed } from "vue";

const props = defineProps<{
  data: any;
  metrics: any[];
}>();

const formatName = (text: string, type?:string) => {
  if (typeof text === 'string' && text.startsWith('Dataset_participant:3D:2022-12-17_')) {
    if(type == 'tooltip'){
      return text.replace('Dataset_participant:', '');
    }else{
      return text.replace('Dataset_participant:3D:2022-12-17_', '');
    }
  }
  return text;
};

// States for pagination
const currentPage = ref(1);
const itemsPerPage = 25; // 5 filas x 4 columnas = 20 botones por página
const columns = 5

// Calculate items to be displayed on the current page
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = props.data.slice(start, end);
  
  // Organizar los elementos en filas de # columnas
  const rows = [];
  for (let i = 0; i < pageData.length; i += columns) {
    rows.push(pageData.slice(i, i + columns));
  }
  return rows;
});

const selected = ref(props.data[0] ? props.data[0] : null);
</script>

<style lang="scss" scoped>
.custom-tabs {
  .no-visible {
    display: none;
  }

  .custom-tabs__table {
    table {
      width: 100%;
      border-collapse: collapse;

      td {
        padding: 5px;
        text-align: center;
      }
    }
  }

  .custom-tabs__pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
      margin: 0 10px;
      padding: 8px 16px;
      cursor: pointer;
      background-color: rgb(241, 245, 249, 0.5);
      border: none;
      border-radius: 6px;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .custom-tabs-button {
    border-radius: 6px;
    color: theme("colors.gray.500");
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    width: 15em;
    padding: 8px 10px;
    text-align: center;
    text-decoration: none;
    background-color: rgb(241, 245, 249, 0.5);
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }

  .custom-tabs-button--active {
    background-color: theme("colors.secondaryOeb.100");
    color: theme("colors.secondaryOeb.500");
  }
}
</style>
