import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from './components/layout.vue'
import Forms from './pages/forms.vue'
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
        path: 'forms',
        component: Forms,
      },
      {
        path: 'forms/:form',
        component: Forms,
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