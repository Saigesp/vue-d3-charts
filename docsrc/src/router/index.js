import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {path: '/barchart',          name: 'barchart',           component: () => import('../views/BarChart.vue')},
  {path: '/linechart',         name: 'linechart',          component: () => import('../views/LineChart.vue')},
  {path: '/slopechart',        name: 'slopechart',         component: () => import('../views/SlopeChart.vue')}
]

const router = new VueRouter({
  routes
})

export default router
