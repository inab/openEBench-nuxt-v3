<template>
	<div class="row">
		<div class="col-12 bg-gray-100 rounded-md ms-2.5">
				<pre class="block language-html pt-3 mx-2">{{ buildText(categorizedLogs.generic) }}<br><br><strong>Result: </strong>{{ buildText(categorizedLogs.result) }}
				</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, toRef } from 'vue';

// Props
const props = defineProps<{
  logs: string[];
}>();

const logsRef = toRef(props, 'logs');
const categorizedLogs = ref({
  generic: [] as string[],
  result: [] as string[],
  status: [] as string[],
});

const categorizeLogs = (logs: string[]) => {
  return {
    generic: logs.filter(log => !log.includes('Result:') && !log.includes('Status:')).map(log => log.trim()),
    result: logs.filter(log => log.includes('Result:')).map(log => log.replace('Result:', '').trim()),
    status: logs.filter(log => log.includes('Status:')).map(log => log.replace('Status:', '').trim()),
  };
};

watch(logsRef, (newLogs) => {
  categorizedLogs.value = categorizeLogs(newLogs);
}, { immediate: true });

const buildText = (logs: string[]) => {
  return logs
    .map(log => log.trim())
    .filter(Boolean)
    .join('\n') || "No logs available";
};

</script>
<style scoped>
pre {
  white-space: pre-wrap; /* Ajusta los saltos de línea sin espacios extra */
  margin: 0; /* Evita márgenes que puedan causar espacios iniciales */
  padding: 0; /* Reduce el padding que pueda generar desplazamiento */
}

</style>