<script setup>
defineProps({
  acoes: {
    type: Array,
    required: true,
    default: () => []
  },
  // ADICIONADO: Recebe o Set enviado pelo MercadoView com os tickers que mudaram de preço
  piscando: {
    type: Object,
    default: () => new Set()
  }
})

const emit = defineEmits(['comprar', 'remover'])
</script>

<template>
  <div class="w-full overflow-x-auto bg-black rounded-xl border border-zinc-900">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-zinc-800/60 text-zinc-400/80 text-xs font-semibold tracking-wider">
          <th class="px-6 py-4">Ticker</th>
          <th class="px-6 py-4">Preço</th>
          <th class="px-6 py-4">Variação ($)</th>
          <th class="px-6 py-4">Variação (%)</th>
          <th class="px-6 py-4 text-center w-1 whitespace-nowrap">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-900/50 text-sm font-medium">
        <tr 
          v-for="acao in acoes" 
          :key="acao.codigo" 
          class="hover:bg-zinc-950/40 transition-colors"
        >
          <td class="px-6 py-4 text-zinc-200 font-bold tracking-wide">
            {{ acao.codigo }}
          </td>

          <td 
            class="px-6 py-4 font-mono transition-all duration-300"
            :class="piscando.has(acao.codigo) ? 'text-yellow-400 scale-105 font-bold' : 'text-zinc-300'"
          >
            {{ acao.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </td>

          <td 
            class="px-6 py-4 font-mono transition-all"
            :class="acao.variacao_nominal >= 0 ? 'text-green-500' : 'text-red-500'"
          >
            <span class="inline-block mr-1">
              {{ acao.variacao_nominal >= 0 ? '▲' : '▼' }}
            </span>
            {{ acao.variacao_nominal >= 0 ? '+' : '' }}{{ acao.variacao_nominal.toFixed(2).replace('.', ',') }}
          </td>

          <td 
            class="px-6 py-4 font-mono" 
            :class="parseFloat(acao.variacao_percentual || 0) >= 0 ? 'text-green-500' : 'text-red-500'"
          >
            {{ parseFloat(acao.variacao_percentual || 0) >= 0 ? '+' : '' }}{{ typeof acao.variacao_percentual === 'number' ? acao.variacao_percentual.toFixed(2) : acao.variacao_percentual }}%
          </td>

          <td class="px-6 py-4 text-center w-1 whitespace-nowrap">
            <div class="flex items-center justify-center gap-3">
              <button 
                @click="emit('comprar', acao)"
                class="px-3 py-1.5 bg-transparent border border-green-900/60 hover:border-green-500 text-green-500 hover:bg-green-500/10 text-xs font-semibold rounded transition-all cursor-pointer"
              >
                Comprar
              </button>
              <button 
                @click="emit('remover', acao.codigo)"
                class="px-3 py-1.5 bg-transparent border border-red-950 hover:border-red-600 text-red-500 hover:bg-red-600/10 text-xs font-semibold rounded transition-all cursor-pointer"
              >
                Remover
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="acoes.length === 0">
          <td colspan="5" class="px-6 py-10 text-center text-zinc-500 text-sm">
            Nenhuma ação adicionada à sua lista de interesse.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>