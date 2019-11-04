import D3BarChart from "./barchart.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("D3BarChart", D3BarChart);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

D3BarChart.install = install;

export default D3BarChart;