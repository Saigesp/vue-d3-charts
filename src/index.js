import Vue from "vue";
import D3BarChart from "./barchart/d3.barchart.vue";
import D3LineChart from "./linechart/d3.linechart.vue";
import D3SlopeChart from "./slopechart/d3.slopechart.vue";
import D3PieChart from "./piechart/d3.piechart.vue";
import D3Sunburst from "./sunburst/d3.sunburst.vue";
import D3WordsCloud from "./wordscloud/d3.wordscloud.vue";

const Components = {
    D3BarChart,
    D3LineChart,
    D3SlopeChart,
    D3PieChart,
    D3Sunburst,
    D3WordsCloud,
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;