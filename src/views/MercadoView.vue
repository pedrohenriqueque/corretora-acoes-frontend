<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import api from '@/services/api'
import TabelaAcoes from '@/components/TabelaAcoes.vue'
import ModalAdicionarAcao from '@/components/ModalAdicionarAcao.vue'
import ModalComprarAcao from '@/components/ModalComprarAcao.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const router = useRouter()
const { user, token, logout } = useAuth()

// --- ESTADOS REATIVOS ---
const horarioSistema = ref('14:00')
const listaAcoes = ref([])
const carregandoTempo = ref(false)
const celulasAlteradas = ref(new Set())

// --- ESTADOS DA MODAL DE ADICIONAR ---
const mostrarModalAdicionar = ref(false)
const acoesDisponiveisParaAdicionar = ref([])
const carregandoListaDisponiveis = ref(false)

// Função auxiliar para rastrear mudanças de preço (efeito piscar)
const dispararEfeitoPiscar = (novasAcoes) => {
  celulasAlteradas.value.clear()
  novasAcoes.forEach(nova => {
    const antiga = listaAcoes.value.find(a => a.codigo === nova.codigo)
    if (antiga && antiga.preco !== nova.preco) {
      celulasAlteradas.value.add(nova.codigo)
    }
  })
  setTimeout(() => celulasAlteradas.value.clear(), 1000)
}

// 1. Carregar dados iniciais do mercado (Bate no seu /mercado/ListaAcoesInteresse)
const carregarDadosMercado = async () => {
  try {
    const response = await api.get('/mercado/ListaAcoesInteresse')
    
    horarioSistema.value = response.data.horaNegociacao
    listaAcoes.value = response.data.acoes || []
  } catch (error) {
    console.error('Erro ao conectar com /mercado/ListaAcoesInteresse:', error)
  }
}

// 2. Avançar o relógio do sistema (Bate no seu /mercado/AvancaTempo)
const handleAvancarTempo = async (minutos) => {
  // BLOQUEIO ANTES DA REQUISIÇÃO: Impede cliques duplos que pulam o tempo além do esperado
  if (carregandoTempo.value) return
  carregandoTempo.value = true
  
  try {
    const response = await api.post('/mercado/AvancaTempo', { incrementoMinutos: minutos })
    
    horarioSistema.value = response.data.novaHoraNegociacao
    
    // Atualiza a lista filtrada recebida diretamente do backend adaptado
    if (response.data.acoes) {
      dispararEfeitoPiscar(response.data.acoes)
      listaAcoes.value = response.data.acoes
    }
    if (response.data.aviso) alert(response.data.aviso)
  } catch (error) {
    alert(error.response?.data?.error || 'Erro ao avançar o tempo.')
  } finally {
    // Desbloqueia o botão apenas quando o ciclo da requisição terminar
    carregandoTempo.value = false
  }
}

// 3. Consultar ações do mercado não inclusas no painel (Bate no seu /mercado/acoes-disponiveis)
const abrirModalSelecaoAcoes = async () => {
  mostrarModalAdicionar.value = true
  carregandoListaDisponiveis.value = true
  try {
    const response = await api.get('/mercado/acoes-disponiveis')
    acoesDisponiveisParaAdicionar.value = response.data
  } catch (error) {
    console.error('Erro ao buscar ações do mercado:', error)
  } finally {
    carregandoListaDisponiveis.value = false
  }
}

// 4. Salvar ação selecionada na modal (Bate no seu /mercado/AdicionaAcaoInteresse)
const handleAdicionarAcaoPorCodigo = async (codigo) => {
  try {
    const response = await api.post('/mercado/AdicionaAcaoInteresse', { codigo })
    
    listaAcoes.value = response.data.acoes
    horarioSistema.value = response.data.horaNegociacao
    
    // Remove o item da lista da modal de seleção localmente
    acoesDisponiveisParaAdicionar.value = acoesDisponiveisParaAdicionar.value.filter(a => a.codigo !== codigo)
  } catch (error) {
    alert(error.response?.data?.error || 'Erro ao adicionar ação.')
  }
}

// 5. Deletar ação da listagem (Bate no seu /mercado/RemoveAcaoInteresse)
const handleRemoverAcao = async (codigoAcao) => {
  try {
    const response = await api.delete('/mercado/RemoveAcaoInteresse', {
      data: { codigo: codigoAcao }
    })
    
    listaAcoes.value = response.data.acoes
  } catch (error) {
    alert(error.response?.data?.error || 'Erro ao remover ação.')
  }
}

const mostrarModalCompra = ref(false)
const acaoSelecionadaParaCompra = ref(null)

const abrirModalCompra = (acao) => {
  acaoSelecionadaParaCompra.value = acao
  mostrarModalCompra.value = true
}

const handleConfirmarCompra = async (dadosOrdem, finalizarLoading) => {
  try {
    const response = await api.post('/ordem/comprar-acao', dadosOrdem)
    
    alert(response.data.message || 'Ordem de compra enviada com sucesso!')
    mostrarModalCompra.value = false
  } catch (error) {
    alert(error.response?.data?.error || 'Erro ao processar ordem de compra.')
  } finally {
    finalizarLoading()
  }
}

onMounted(() => {
  if (!token.value) {
    router.push('/')
  } else {
    carregarDadosMercado()
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col justify-between font-sans antialiased relative">

    <HeaderComponent></HeaderComponent>

    <div class="bg-[#050706] border-b border-zinc-900 px-6 py-3">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
            <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="text-sm font-mono text-zinc-200 font-bold tracking-wider">{{ horarioSistema }} hr</span>
          </div>

          <div class="flex items-center gap-2">
            <button @click="handleAvancarTempo(1)" :disabled="carregandoTempo" class="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[11px] font-medium text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">+ 1 min</button>
            <button @click="handleAvancarTempo(5)" :disabled="carregandoTempo" class="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[11px] font-medium text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">+ 5 min</button>
          </div>
        </div>

        <button @click="abrirModalSelecaoAcoes" class="flex items-center gap-1 px-4 py-2 bg-[#00b37e] hover:bg-[#008e63] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Adicionar Ação
        </button>

      </div>
    </div>

    <main class="max-w-6xl mx-auto px-6 py-8 flex-grow w-full">
      <TabelaAcoes 
        :acoes="listaAcoes" 
        :piscando="celulasAlteradas"
        @remover="handleRemoverAcao"
        @comprar="abrirModalCompra"
      />
    </main>

    <ModalAdicionarAcao 
      :mostrar="mostrarModalAdicionar"
      :acoes-disponiveis="acoesDisponiveisParaAdicionar"
      :carregando="carregandoListaDisponiveis"
      @fechar="mostrarModalAdicionar = false"
      @adicionar="handleAdicionarAcaoPorCodigo"
    />


    <ModalComprarAcao 
      :mostrar="mostrarModalCompra"
      :acao="acaoSelecionadaParaCompra"
      @fechar="mostrarModalCompra = false"
      @confirmar="handleConfirmarCompra"
    />

    <FooterComponent></FooterComponent>    
  </div>
</template>