import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCodeHighlight from 'vue-code-highlight';
import './assets/styles/_index.scss'
import '../node_modules/vue-code-highlight/themes/prism.css'
import './components/index'

Vue.use(VueCodeHighlight)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
