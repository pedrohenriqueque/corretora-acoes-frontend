<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, token, logout } = useAuth()

onMounted(() => {
  if (!token.value) {
    router.push('/')
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>
<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased">
    <!-- Header -->
    <header class="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center">
            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
          <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">BolsaSim</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-400 font-medium" v-if="user">Olá, {{ user.nome }}</span>
          <button 
            @click="handleLogout" 
            class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 hover:text-white transition-all cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-6xl mx-auto px-6 py-12 flex-grow w-full">
      <div class="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 max-w-2xl mx-auto text-center mt-12">
        <div class="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-white mb-4">Área do Investidor</h1>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">
          Você se autenticou com sucesso! Este é o painel principal do simulador de ações (BolsaSim). Aqui serão exibidas as cotações em tempo real, sua carteira de investimentos e seu saldo em conta corrente.
        </p>
        <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-2 text-xs font-mono text-slate-400" v-if="user">
          <div class="flex justify-between border-b border-slate-900 pb-1.5"><span class="text-slate-500">ID Usuário:</span> <span>{{ user.id_usuario }}</span></div>
          <div class="flex justify-between border-b border-slate-900 pb-1.5"><span class="text-slate-500">Nome:</span> <span>{{ user.nome }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">E-mail:</span> <span>{{ user.email }}</span></div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-600 bg-slate-950/40">
      &copy; 2026 BolsaSim. Todos os direitos reservados.
    </footer>
  </div>
</template>
