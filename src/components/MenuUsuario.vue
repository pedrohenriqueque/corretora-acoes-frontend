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
  <div class="relative inline-block" v-if="user">
    
    <button 
      @click.stop="alternarDropdown" 
      id="user-menu-button"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer border border-transparent bg-transparent"
    >
      <span>Olá, {{ user.nome }}</span>
      <svg 
        class="h-3.5 w-3.5 text-zinc-500 transition-transform duration-200" 
        :class="{ 'rotate-180': dropdownAberto }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div 
      v-if="dropdownAberto" 
      class="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-2xl flex flex-col gap-1 z-50"
    >
      <router-link 
        to="/alterar-senha" 
        class="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-md transition-colors decoration-none"
      >
        <svg class="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Alterar Senha
      </router-link>
      
      <hr class="border-zinc-900 my-1" />
      
      <button 
        @click="handleLogout" 
        class="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-colors text-left w-full cursor-pointer bg-transparent border-none font-sans"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sair da Conta
      </button>
    </div>

  </div>
</template>