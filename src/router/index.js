import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MercadoView from '../views/MercadoView.vue'
import AlterarSenha from '@/views/AlterarSenha.vue'


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
      component: AlterarSenha
    }
  ]
})

export default router
