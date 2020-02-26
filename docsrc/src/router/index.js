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
  {path: '/examples',          name: 'examples',           component: () => import('../views/Examples.vue')},
  {path: '/barchart',          name: 'barchart',           component: () => import('../views/BarChart.vue')},
  {path: '/linechart',         name: 'linechart',          component: () => import('../views/LineChart.vue')},
  {path: '/slopechart',        name: 'slopechart',         component: () => import('../views/SlopeChart.vue')},
  {path: '/piechart',          name: 'piechart',           component: () => import('../views/PieChart.vue')},
  {path: '/sunburst',          name: 'sunburst',           component: () => import('../views/Sunburst.vue')},
  {path: '/wordscloud',        name: 'wordscloud',         component: () => import('../views/WordsCloud.vue')},
  {path: '/sliceschart',       name: 'sliceschart',        component: () => import('../views/SlicesChart.vue')},
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
