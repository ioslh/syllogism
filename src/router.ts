import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from './components/layout.vue'
import Form from './pages/form.vue'
import Validate from './pages/validate.vue'
import Fallacies from './pages/fallacies.vue'


const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'validate',
        component: Validate,
      },
      {
        path: 'form',
        component: Form,
      },
      {
        path: 'fallacies',
        component: Fallacies
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})