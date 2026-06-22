<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import MenuUsuario from './MenuUsuario.vue'

const router = useRouter()
const { user, logout } = useAuth()
const dropdownAberto = ref(false)

const alternarDropdown = () => {
  dropdownAberto.value = !dropdownAberto.value
}

const fecharDropdownAoClicarFora = (event) => {
  if (!event.target.closest('#user-menu-button')) {
    dropdownAberto.value = false
  }
}

const handleLogout = () => {
  logout()
  localStorage.clear()
  sessionStorage.clear()
  router.push('/')
}

onMounted(() => {
  window.addEventListener('click', fecharDropdownAoClicarFora)
})

onUnmounted(() => {
  window.removeEventListener('click', fecharDropdownAoClicarFora)
})
</script>

<template>
  <header class="border-b border-zinc-800 bg-black/90 backdrop-blur-md px-6 py-4 relative z-50">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/mercado" class="flex items-center gap-3 decoration-none">
          <span class="h-9 w-9 rounded-xl bg-green-500 flex items-center justify-center">
            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
          <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">BolsaSim</span>
        </router-link>

        <div class="flex items-center gap-3">
          <router-link to="/carteira" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#090e0c] border border-green-900/40 hover:border-green-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all">Minha Carteira</router-link>
          <router-link to="/conta-corrente" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#090e0c] border border-green-900/40 hover:border-green-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all">Conta Corrente</router-link>
        </div>
      </div>

      <menu-usuario/>
    </div>
  </header>
</template>