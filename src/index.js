import Vue from "vue";
import D3BarChart from "./barchart.vue";
import D3LineChart from "./linechart.vue";

const Components = {
    D3BarChart,
    D3LineChart
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;