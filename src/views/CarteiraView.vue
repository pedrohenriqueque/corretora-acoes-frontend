<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import api from '@/services/api'
import ModalVenderAcao from '@/components/ModalVenderAcao.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import MenuUsuario from '@/components/MenuUsuario.vue'

const router = useRouter()
const { user, token, logout } = useAuth()
const { success: showSuccess, error: showError } = useToast()

// --- STATE ---
const horarioSistema = ref('14:00')
const posicoes = ref([])
const ganhoPerdaTotal = ref(0)
const carregando = ref(false)
const carregandoTempo = ref(false)
const celulasAlteradas = ref(new Set())

// Modal Venda
const mostrarModalVenda = ref(false)
const posicaoSelecionada = ref(null)

// --- COMPUTED ---
const valorTotalCarteira = computed(() => {
  return posicoes.value.reduce((acc, p) => acc + (p.quantidade * p.preco), 0)
})

const percentualGanhoPerdaTotal = computed(() => {
  const investido = valorTotalCarteira.value - ganhoPerdaTotal.value
  if (!investido || investido === 0) return 0
  return (ganhoPerdaTotal.value / investido) * 100
})

const totalAtivos = computed(() => posicoes.value.length)

// --- FORMAT HELPERS ---
const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(valor ?? 0)

const formatarPercentual = (valor) => {
  const sinal = valor >= 0 ? '+' : ''
  return `${sinal}${(valor ?? 0).toFixed(2)}%`
}

// --- EFEITO PISCAR ---
const dispararEfeitoPiscar = (novasPosicoes) => {
  celulasAlteradas.value.clear()
  novasPosicoes.forEach(nova => {
    const antiga = posicoes.value.find(p => p.codigo === nova.codigo)
    if (antiga && antiga.preco !== nova.preco) {
      celulasAlteradas.value.add(nova.codigo)
    }
  })
  setTimeout(() => celulasAlteradas.value.clear(), 1200)
}

// --- API ---
const carregarCarteira = async () => {
  carregando.value = true
  try {
    const response = await api.get('/carteira')
    horarioSistema.value = response.data.horaNegociacao
    ganhoPerdaTotal.value = response.data.ganhos_perdas_total ?? 0
    posicoes.value = response.data.acoes ?? []
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao carregar a carteira.')
  } finally {
    carregando.value = false
  }
}

const handleAvancarTempo = async (minutos) => {
  if (carregandoTempo.value) return
  carregandoTempo.value = true
  try {
    await api.post('/mercado/AvancaTempo', { incrementoMinutos: minutos })
    // Recarregar a carteira com preços atualizados
    const response = await api.get('/carteira')
    horarioSistema.value = response.data.horaNegociacao
    ganhoPerdaTotal.value = response.data.ganhos_perdas_total ?? 0
    dispararEfeitoPiscar(response.data.acoes ?? [])
    posicoes.value = response.data.acoes ?? []
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao avançar o tempo.')
  } finally {
    carregandoTempo.value = false
  }
}

const abrirModalVenda = (posicao) => {
  posicaoSelecionada.value = posicao
  mostrarModalVenda.value = true
}

const handleConfirmarVenda = async (dadosOrdem, finalizarLoading) => {
  try {
    const response = await api.post('/ordem/vender-acao', dadosOrdem)
    const statusOrdem = response.data.status === 'PENDENTE' ? 'Ordem de venda programada!' : 'Venda realizada com sucesso!'
    showSuccess(statusOrdem)
    mostrarModalVenda.value = false
    await carregarCarteira()
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao processar a ordem de venda.')
  } finally {
    finalizarLoading()
  }
}

onMounted(() => {
  if (!token.value) {
    router.push('/')
  } else {
    carregarCarteira()
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
    <header class="border-b border-zinc-800 bg-black/90 backdrop-blur-md px-6 py-3.5">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">

        <!-- Logo + Title -->
        <div class="flex items-center gap-4 flex-shrink-0">
          <div class="flex items-center gap-3">
            <span class="h-9 w-9 rounded-xl bg-green-500 flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
            <span
              class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">BolsaSim</span>
          </div>
          <span class="text-zinc-700 text-xl font-light select-none">|</span>
          <span class="text-white font-semibold text-base tracking-tight">Carteira</span>
        </div>

        <!-- Clock + time controls -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
            <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-mono text-zinc-200 font-bold tracking-wider">{{ horarioSistema }} hr</span>
          </div>
          <button @click="handleAvancarTempo(1)" :disabled="carregandoTempo"
            class="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[11px] font-medium text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            + 1 min
          </button>
          <button @click="handleAvancarTempo(5)" :disabled="carregandoTempo"
            class="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[11px] font-medium text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            + 5 min
          </button>
        </div>

        <!-- Navigation + user -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <router-link to="/mercado"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#090e0c] border border-green-900/40 hover:border-green-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all decoration-none">
            <svg class="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para o Mercado
          </router-link>

          <router-link to="/conta-corrente"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#090e0c] border border-green-900/40 hover:border-green-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all decoration-none">
            Ir para Conta Corrente
            <svg class="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>

          <span class="text-zinc-800 text-sm select-none mx-1">|</span>
          <MenuUsuario />
        </div>
      </div>
    </header>

    <!-- ===== SUMMARY CARDS ===== -->
    <div class="border-b border-zinc-900 bg-[#050706] px-6 py-5">
      <div class="max-w-6xl mx-auto grid grid-cols-2 gap-4">

        <!-- Valor da Carteira -->
        <div class="flex items-center gap-4 bg-zinc-950 border border-zinc-800/60 rounded-xl px-5 py-4">
          <div
            class="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-1.5 mb-0.5">
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Valor da Carteira</p>
              <svg class="h-3 w-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-white tracking-tight leading-none">
              <span v-if="carregando" class="text-zinc-600 animate-pulse text-lg">Carregando...</span>
              <span v-else>{{ formatarMoeda(valorTotalCarteira) }}</span>
            </p>
            <p class="text-xs text-zinc-500 mt-1">Valor atual de mercado de todas as posições</p>
          </div>
        </div>

        <!-- Ganho/Perda Total -->
        <div class="flex items-center gap-4 bg-zinc-950 border border-zinc-800/60 rounded-xl px-5 py-4">
          <div :class="['h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 border',
            ganhoPerdaTotal >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-rose-500/10 border-rose-500/20']">
            <svg :class="['h-6 w-6', ganhoPerdaTotal >= 0 ? 'text-green-400' : 'text-rose-400']" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" :d="ganhoPerdaTotal >= 0
                ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                : 'M13 17H5m0 0V9m0 8l8-8 4 4 6-6'" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-1.5 mb-0.5">
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ganho / Perda Total</p>
              <svg class="h-3 w-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p
              :class="['text-2xl font-bold tracking-tight leading-none', ganhoPerdaTotal >= 0 ? 'text-green-400' : 'text-rose-400']">
              <span v-if="carregando" class="text-zinc-600 animate-pulse text-lg">Carregando...</span>
              <span v-else>{{ ganhoPerdaTotal < 0 ? '-' : '' }}{{ formatarMoeda(Math.abs(ganhoPerdaTotal)) }}</span>
            </p>
            <p :class="['text-xs font-semibold mt-1', ganhoPerdaTotal >= 0 ? 'text-green-500' : 'text-rose-500']">
              {{ formatarPercentual(percentualGanhoPerdaTotal) }} em relação ao valor investido
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- ===== MAIN TABLE ===== -->
    <main class="max-w-6xl mx-auto px-6 py-6 flex-grow w-full">

      <!-- Section header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-bold text-zinc-300 uppercase tracking-widest">Minha Carteira</h2>
        <span class="text-xs text-zinc-500">Exibindo {{ totalAtivos }} ativo{{ totalAtivos !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Loading -->
      <div v-if="carregando" class="flex flex-col items-center justify-center py-24 gap-4">
        <svg class="h-8 w-8 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-sm text-zinc-500">Carregando sua carteira...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="posicoes.length === 0" class="flex flex-col items-center justify-center py-24 gap-3">
        <div class="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
          <svg class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <p class="text-base font-semibold text-zinc-400">Sua carteira está vazia</p>
        <p class="text-sm text-zinc-600">Compre ações no mercado para começar.</p>
        <button @click="router.push('/mercado')"
          class="mt-2 px-5 py-2.5 bg-[#00b37e] hover:bg-[#008e63] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
          Ir para o Mercado
        </button>
      </div>

      <!-- Positions table -->
      <div v-else class="w-full overflow-x-auto rounded-xl border border-zinc-800/60">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-800 bg-zinc-950/60">
              <th class="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Ticker</th>
              <th class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Quantidade
              </th>
              <th
                class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                Preço Médio (R$)</th>
              <th
                class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                Preço Atual (R$)</th>
              <th class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">G/P (R$)</th>
              <th class="text-right px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">G/P (%)</th>
              <th class="text-center px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="posicao in posicoes" :key="posicao.codigo" :class="['border-b border-zinc-900/80 transition-all duration-300',
              celulasAlteradas.has(posicao.codigo) ? 'bg-zinc-800/40' : 'hover:bg-zinc-900/30']">
              <!-- Ticker -->
              <td class="px-5 py-4">
                <span class="font-bold text-white tracking-wide">{{ posicao.codigo }}</span>
              </td>

              <!-- Quantidade -->
              <td class="px-5 py-4 text-right font-mono text-zinc-300">
                {{ posicao.quantidade.toLocaleString('pt-BR') }}
              </td>

              <!-- Preço Médio -->
              <td class="px-5 py-4 text-right font-mono text-zinc-300">
                {{ formatarMoeda(posicao.preco_medio) }}
              </td>

              <!-- Preço Atual com efeito piscar -->
              <td :class="['px-5 py-4 text-right font-mono font-semibold transition-colors duration-500',
                celulasAlteradas.has(posicao.codigo) ? 'text-yellow-300' : 'text-white']">
                {{ formatarMoeda(posicao.preco) }}
              </td>

              <!-- G/P R$ -->
              <td :class="['px-5 py-4 text-right font-mono font-semibold',
                posicao.ganho_perda >= 0 ? 'text-green-400' : 'text-rose-400']">
                {{ posicao.ganho_perda < 0 ? '-' : '' }}{{ formatarMoeda(Math.abs(posicao.ganho_perda)) }} </td>

                  <!-- G/P % -->
              <td :class="['px-5 py-4 text-right font-semibold',
                posicao.ganho_perda >= 0 ? 'text-green-400' : 'text-rose-400']">
                {{
                  posicao.preco_medio > 0
                    ? formatarPercentual(((posicao.preco - posicao.preco_medio) / posicao.preco_medio) * 100)
                    : '—'
                }}
              </td>

              <!-- Ações -->
              <td class="px-5 py-4 text-center">
                <button @click="abrirModalVenda(posicao)"
                  class="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-semibold rounded-lg transition-all cursor-pointer">
                  Vender
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table footer note -->
        <div class="flex items-center gap-3 px-5 py-3 bg-zinc-950/40 border-t border-zinc-900">
          <svg class="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs text-zinc-500 italic">
            Os preços são atualizados conforme o relógio da simulação.
            Use os controles acima para avançar o tempo e acompanhar as variações.
          </span>
        </div>
      </div>
    </main>

    <FooterComponent />

    <ModalVenderAcao :mostrar="mostrarModalVenda" :posicao="posicaoSelecionada" @fechar="mostrarModalVenda = false"
      @confirmar="handleConfirmarVenda" />
  </div>
</template>
