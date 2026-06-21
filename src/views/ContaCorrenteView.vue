<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import axios from 'axios'
import ModalSimularLancamento from '@/components/ModalSimularLancamento.vue'

const router = useRouter()
const { user, token, logout } = useAuth()
const { success: showSuccess, error: showError } = useToast()

// --- ESTADOS ---
const lancamentos = ref([])
const carregando = ref(false)

// Modal
const mostrarModal = ref(false)
const tipoModal = ref('deposito') // 'deposito' | 'retirada'

const API_URL = 'http://localhost:3000'

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${token.value}` }
})

// --- COMPUTED ---
// Os lançamentos retornados pela API vêm em ordem cronológica (mais antigo primeiro).
// Portanto, o saldo mais recente está no último elemento do array.
const saldoAtual = computed(() => {
  if (lancamentos.value.length === 0) return 0
  return lancamentos.value[lancamentos.value.length - 1].saldo_resultante
})

// Exibe os lançamentos com os mais recentes no topo (como na imagem)
const lancamentosExibidos = computed(() => {
  return [...lancamentos.value].reverse()
})

const totalLancamentos = computed(() => lancamentos.value.length)

// --- FORMATAÇÃO ---
const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(valor)
}

const formatarDataHora = (dataHora) => {
  if (!dataHora) return '—'
  // O backend retorna no formato de hora da simulação (ex: "14:10" ou "20/05/2026 14:10")
  return dataHora
}

// --- API CALLS ---
const carregarExtrato = async () => {
  carregando.value = true
  try {
    const response = await axios.get(`${API_URL}/conta-corrente`, getAuthConfig())
    lancamentos.value = response.data || []
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao carregar o extrato da conta corrente.')
  } finally {
    carregando.value = false
  }
}

const abrirModalDeposito = () => {
  tipoModal.value = 'deposito'
  mostrarModal.value = true
}

const abrirModalRetirada = () => {
  tipoModal.value = 'retirada'
  mostrarModal.value = true
}

const handleConfirmarLancamento = async (dados, finalizarLoading) => {
  const endpoint = tipoModal.value === 'deposito'
    ? `${API_URL}/conta-corrente/deposito`
    : `${API_URL}/conta-corrente/retirada`

  try {
    await axios.post(endpoint, dados, getAuthConfig())
    showSuccess(
      tipoModal.value === 'deposito'
        ? 'Depósito registrado com sucesso!'
        : 'Retirada registrada com sucesso!'
    )
    mostrarModal.value = false
    await carregarExtrato()
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao registrar o lançamento.')
  } finally {
    finalizarLoading()
  }
}

onMounted(() => {
  if (!token.value) {
    router.push('/')
  } else {
    carregarExtrato()
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col font-sans antialiased">

    <!-- ===== HEADER ===== -->
    <header class="border-b border-zinc-800 bg-black/90 backdrop-blur-md px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">

        <!-- Left: Logo + Page title -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <span class="h-9 w-9 rounded-xl bg-green-500 flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
            <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">BolsaSim</span>
          </div>

          <!-- Separator -->
          <span class="text-zinc-700 text-xl font-light select-none">|</span>
          <span class="text-white font-semibold text-base tracking-tight">Conta Corrente</span>
        </div>

        <!-- Right: Navigation buttons -->
        <div class="flex items-center gap-3">
          <button
            @click="router.push('/mercado')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para o Mercado
          </button>

          <button
            @click="router.push('/carteira')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            Ir para Carteira
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <span class="text-sm text-slate-400 font-medium ml-2" v-if="user">{{ user.nome }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 hover:text-white transition-all cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>
    </header>

    <!-- ===== BALANCE + ACTION BUTTONS ===== -->
    <div class="border-b border-zinc-900 bg-[#050706] px-6 py-5">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-6">

        <!-- Balance card -->
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">Saldo Atual</p>
            <p class="text-3xl font-bold text-white tracking-tight leading-none">
              <span v-if="carregando" class="text-zinc-600 animate-pulse">Carregando...</span>
              <span v-else>{{ formatarMoeda(saldoAtual) }}</span>
            </p>
            <p class="text-xs text-zinc-500 mt-1">Disponível para investir ou retirar</p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-3">
          <button
            id="btn-simular-deposito"
            @click="abrirModalDeposito"
            class="flex items-center gap-2 px-5 py-3 bg-[#00b37e] hover:bg-[#008e63] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-green-900/20 active:scale-95"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
            </svg>
            Simular Depósito
          </button>

          <button
            id="btn-simular-retirada"
            @click="abrirModalRetirada"
            class="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-900/20 active:scale-95"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 20V4m0 0l-4 4m4-4l4 4" />
            </svg>
            Simular Retirada
          </button>
        </div>
      </div>
    </div>

    <!-- ===== MAIN CONTENT: EXTRATO ===== -->
    <main class="max-w-6xl mx-auto px-6 py-8 flex-grow w-full">

      <!-- Section title -->
      <div class="mb-4">
        <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Extrato da Conta Corrente</h2>
      </div>

      <!-- Loading state -->
      <div v-if="carregando" class="flex flex-col items-center justify-center py-24 gap-4">
        <svg class="h-8 w-8 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-sm text-zinc-500">Carregando extrato...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="lancamentos.length === 0" class="flex flex-col items-center justify-center py-24 gap-3">
        <div class="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
          <svg class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-base font-semibold text-zinc-400">Nenhum lançamento encontrado</p>
        <p class="text-sm text-zinc-600">Simule um depósito para começar a investir.</p>
      </div>

      <!-- Table -->
      <div v-else class="w-full overflow-x-auto rounded-xl border border-zinc-800/60">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-800 bg-zinc-950/60">
              <th class="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">Data / Hora</th>
              <th class="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Descrição do Evento</th>
              <th class="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo</th>
              <th class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">Valor da Operação</th>
              <th class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">Saldo Resultante</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(lancamento, index) in lancamentosExibidos"
              :key="lancamento.id ?? index"
              class="border-b border-zinc-900/80 hover:bg-zinc-900/30 transition-colors duration-150"
            >
              <!-- Data/Hora -->
              <td class="px-5 py-4 font-mono text-zinc-300 text-xs whitespace-nowrap">
                {{ formatarDataHora(lancamento.data_hora) }}
              </td>

              <!-- Descrição -->
              <td class="px-5 py-4 text-zinc-200">
                {{ lancamento.descricao }}
              </td>

              <!-- Tipo Badge -->
              <td class="px-5 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                    lancamento.tipo === 'deposito'
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-rose-400 bg-rose-500/10'
                  ]"
                >
                  <span
                    :class="[
                      'h-1.5 w-1.5 rounded-full',
                      lancamento.tipo === 'deposito' ? 'bg-green-400' : 'bg-rose-400'
                    ]"
                  />
                  {{ lancamento.tipo === 'deposito' ? 'Depósito' : 'Retirada' }}
                </span>
              </td>

              <!-- Valor da Operação -->
              <td class="px-5 py-4 text-right font-semibold font-mono whitespace-nowrap"
                :class="lancamento.tipo === 'deposito' ? 'text-green-400' : 'text-rose-400'"
              >
                {{ lancamento.tipo === 'retirada' ? '-' : '' }}{{ formatarMoeda(Math.abs(lancamento.valor)) }}
              </td>

              <!-- Saldo Resultante -->
              <td class="px-5 py-4 text-right text-zinc-300 font-mono whitespace-nowrap">
                {{ formatarMoeda(lancamento.saldo_resultante) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer info bar -->
        <div class="flex items-center justify-between px-5 py-3 bg-zinc-950/40 border-t border-zinc-900">
          <span class="text-xs text-zinc-500">
            Exibindo {{ totalLancamentos }} de {{ totalLancamentos }} lançamentos.
          </span>
          <span class="text-xs text-zinc-600 italic">
            Os lançamentos são exibidos em ordem cronológica (mais recentes primeiro).
          </span>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-600 bg-slate-950/40">
      &copy; 2026 BolsaSim. Todos os direitos reservados.
    </footer>

    <!-- Modal Simular Lançamento -->
    <ModalSimularLancamento
      :mostrar="mostrarModal"
      :tipo="tipoModal"
      @fechar="mostrarModal = false"
      @confirmar="handleConfirmarLancamento"
    />
  </div>
</template>
