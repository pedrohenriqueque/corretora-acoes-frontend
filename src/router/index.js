import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MercadoView from '../views/MercadoView.vue'
import ContaCorrenteView from '../views/ContaCorrenteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/mercado',
      name: 'mercado',
      component: MercadoView
    },
    {
      path: '/conta-corrente',
      name: 'conta-corrente',
      component: ContaCorrenteView
    }
  ]
})

export default router
