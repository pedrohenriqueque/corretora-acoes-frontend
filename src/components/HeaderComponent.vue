<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

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

      <div class="flex items-center gap-4 relative" v-if="user">
        <button 
          @click.stop="alternarDropdown" 
          id="user-menu-button"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-sm text-slate-300 hover:text-white font-medium cursor-pointer"
        >
          <span>Olá, {{ user.nome }}</span>
          <svg 
            class="h-4 w-4 text-slate-500 transition-transform duration-200" 
            :class="{ 'rotate-180': dropdownAberto }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div 
          v-if="dropdownAberto" 
          class="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-xl flex flex-col gap-1"
        >
          <router-link 
            to="/alterar-senha" 
            class="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
          >
            <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Alterar Senha
          </router-link>
          
          <hr class="border-zinc-900 my-0.5" />
          
          <button 
            @click="handleLogout" 
            class="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-colors text-left w-full cursor-pointer"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  </header>
</template>