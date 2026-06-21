<script setup>
import { ref } from 'vue'

const props = defineProps({
  mostrar: { type: Boolean, required: true },
  acoesDisponiveis: { type: Array, required: true },
  carregando: { type: Boolean, default: false }
})

const emit = defineEmits(['fechar', 'adicionar'])

const acaoSendoAdicionada = ref(null)

const selecionarAcao = async (codigo) => {
  acaoSendoAdicionada.value = codigo
  emit('adicionar', codigo)
  setTimeout(() => {
    acaoSendoAdicionada.value = null
  }, 1200)
}
</script>

<template>
  <div 
    v-if="mostrar" 
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
  >
    <div class="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl transform scale-100 transition-transform">
      
      <div class="flex items-center justify-between mb-5 border-b border-zinc-900 pb-3">
        <div>
          <h3 class="text-base font-bold text-zinc-200 tracking-wide">Adicionar Ação ao Painel</h3>
          <p class="text-xs text-zinc-500 mt-0.5">Selecione os ativos que deseja monitorar em tempo real.</p>
        </div>
        <button 
          @click="emit('fechar')" 
          class="text-zinc-500 hover:text-white transition-colors cursor-pointer text-sm p-1.5 hover:bg-zinc-900 rounded-lg"
        >
          ✕
        </button>
      </div>

      <div v-if="carregando" class="text-center py-12 text-xs text-zinc-500 font-medium animate-pulse">
        Consultando mercado...
      </div>
      
      <div 
        v-else-if="acoesDisponiveis.length > 0" 
        class="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-2 
               [&::-webkit-scrollbar]:w-2
               [&::-webkit-scrollbar-track]:bg-zinc-950
               [&::-webkit-scrollbar-thumb]:bg-zinc-800
               [&::-webkit-scrollbar-thumb]:rounded-full
               hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
      >
        <button 
          v-for="disponivel in acoesDisponiveis" 
          :key="disponivel.codigo"
          @click="selecionarAcao(disponivel.codigo)"
          :disabled="acaoSendoAdicionada !== null"
          class="flex items-center justify-between px-3.5 py-3 bg-zinc-900 border border-zinc-800/60 rounded-lg text-xs font-semibold text-zinc-300 text-left transition-all duration-200 
                 hover:bg-zinc-800/80 hover:border-green-500/40 hover:text-white hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
        >
          <span class="tracking-wider group-hover:text-green-400 transition-colors">{{ disponivel.codigo }}</span>
          
          <span class="text-[10px] transition-all duration-200">
            <span v-if="acaoSendoAdicionada === disponivel.codigo" class="text-green-400 font-bold flex items-center gap-1 animate-bounce">
              ✓ Adicionada!
            </span>
            <span v-else class="text-zinc-500 group-hover:text-green-500 font-medium">
              + Selecionar
            </span>
          </span>
        </button>
      </div>

      <div v-else class="text-center py-10 text-xs text-zinc-500">
        Todas as ações disponíveis já estão no seu painel.
      </div>

    </div>
  </div>
</template>