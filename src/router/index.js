import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MercadoView from '../views/MercadoView.vue'

import ContaCorrenteView from '../views/ContaCorrenteView.vue'
import CarteiraView from '../views/CarteiraView.vue'
import AlterarSenhaView from '@/views/AlterarSenhaView.vue'

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
      path: '/alterar-senha',
      name: 'alterar-senha',
      component: AlterarSenhaView
    },
    {
      path: '/conta-corrente',
      name: 'conta-corrente',
      component: ContaCorrenteView
    },
    {
      path: '/carteira',
      name: 'carteira',
      component: CarteiraView
    }
  ]
})

export default router
