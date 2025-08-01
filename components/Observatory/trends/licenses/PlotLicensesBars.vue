<template>
    <div id="plot_2" :style="{ height: height + 'px', width: '100%' }"></div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, nextTick } from 'vue';
import Plotly from 'plotly.js-dist';
import { activeTabIndex } from '@/components/Common/state.js';

// Define props
const props = defineProps<{
    counts_permissive: number[];
    licenses_permissive: string[];
    counts_copyleft: number[];
    licenses_copyleft: string[];
    counts_data: number[];
    licenses_data: string[];
    title?: string;
    height?: number;
}>();

// Set defaults for optional props
const { title = '', height = 280 } = props;

// Define labs and layout
const labs = {
    Artistic: '<a href="https://opensource.org/licenses/artistic-license">Artistic</a>',
    MIT: '<a href="https://opensource.org/licenses/MIT">MIT</a>',
    Apache: '<a href="https://opensource.org/licenses/apachepl.php">Apache</a>',
    BSD: '<a href="https://www.freebsd.org/doc/en_US.ISO8859-1/articles/bsdl-gpl/article.html">BSD</a>',
    GPL: '<a href="https://www.gnu.org/licenses/gpl-3.0.html">GPL</a>',
    AGPL: '<a href="https://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>',
    LGPL: '<a href="https://www.gnu.org/licenses/lgpl-3.0.html">LGPL</a>',
    'CeCILL-C': '<a href="https://spdx.org/licenses/CECILL-C.html">CeCILL-C</a>',
    CeCILL: '<a href="https://spdx.org/licenses/CECILL-C.html">CeCILL-C</a>',
    CC: '<a href="https://creativecommons.org/licenses/">CC</a>',
};

const layout = {
    yaxis: {
        title: 'Number of software',
    },
    xaxis: {
        title: 'License Family/Type',
        categoryorder: 'total ascending',
    },
    hoverlabel: { bgcolor: '#FFF' },
    autosize: true,
    height: height,
    margin: { b: 70, t: 40, r: 0 },
    title: { text: title },
};

const config = {
    responsive: true,
    displayModeBar: false,
};

// Build trace function
function buildTrace(
    x: string[],
    y: number[],
    name: string,
    color: string,
    border: string,
    labs: Record<string, string>
) {
    return {
        type: 'bar',
        x: x.map((a) => labs[a] || a),
        y,
        name,
        customdata: y.map((c) => (c / y.reduce((a, b) => a + b)) * 100),
        hovertemplate:
            '%{x} <br> %{y:,d} software <br> %{customdata:.1f}% of OpenSource <extra></extra>',
        marker: {
            color,
            opacity: 0.9,
            line: {
                color: border,
                width: 1,
            },
        },
    };
}

// Define traces as computed properties
const trace1 = computed(() =>
    buildTrace(
        props.licenses_copyleft,
        props.counts_copyleft,
        'Copyleft',
        '#233757',
        '#ffffff',
        labs
    )
);

const trace2 = computed(() =>
    buildTrace(
        props.licenses_permissive,
        props.counts_permissive,
        'Permissive',
        '#568bdb',
        '#ffffff',
        labs
    )
);

const trace3 = computed(() =>
    buildTrace(
        props.licenses_data,
        props.counts_data,
        'Data',
        '#a2c3f5',
        '#ffffff',
        labs
    )
);

// Plot the chart on mount
onMounted(() => {
    const traces = [];

    if (props.licenses_copyleft.length > 0) traces.push(trace1.value);
    if (props.licenses_permissive.length > 0) traces.push(trace2.value);
    if (props.licenses_data.length > 0) traces.push(trace3.value);

    Plotly.newPlot('plot_2', traces, layout, config);
});

watch(activeTabIndex, async () => {
    await nextTick();
    Plotly.relayout('plot_2', { autosize: true });
});
</script>

<style scoped>
#plot_2 {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
}
</style>