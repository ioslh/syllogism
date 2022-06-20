import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from './components/layout.vue'
import Validate from './pages/validate.vue'
import Fallacies from './pages/fallacies.vue'


const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/validate',
      },
      {
        path: 'validate',
        component: Validate,
      },
      {
        path: 'fallacies',
        component: Fallacies
      },
      {
        path: 'fallacies/:fallacy',
        component: Fallacies
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})