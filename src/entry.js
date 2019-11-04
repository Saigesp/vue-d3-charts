import component from "./VueD3Charts.vue";
import component2 from "./VueD3Charts2.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("VueD3Charts", component);
  Vue.component("VueD3Charts2", component2);
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

component.install = install;

export {component, component2};