<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: { type: Boolean, required: true },
  acao: { type: Object, default: null }
})

const emit = defineEmits(['fechar', 'confirmar'])

const quantidade = ref(0)
const tipoOrdem = ref('MERCADO') 
const precoOrdem = ref('')
const carregando = ref(false)

watch(() => props.mostrar, (estaVisivel) => {
  if (estaVisivel) {
    quantidade.value = 0
    tipoOrdem.value = 'MERCADO'
    precoOrdem.value = ''
  }
})

const submeterOrdem = () => {
  carregando.value = true
  
  // Monta o payload exatamente como o seu OrdemController espera receber no req.body
  const payload = {
    codigo: props.acao.codigo,
    quantidade: Number(quantidade.value),
    tipoOrdem: tipoOrdem.value,
    precoOrdem: tipoOrdem.value === 'PROGRAMADA' ? Number(precoOrdem.value) : null
  }

  // Deixa o backend decidir se aprova ou joga no bloco catch
  emit('confirmar', payload, () => {
    carregando.value = false
  })
}
</script>

<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-sm p-6 shadow-2xl relative">
      
      <button @click="emit('fechar')" class="absolute top-4 right-4 text-zinc-500 hover:text-white text-sm cursor-pointer">✕</button>

      <h3 class="text-lg font-bold text-zinc-200">Comprar {{ acao?.codigo }}</h3>
      <p class="text-xs text-zinc-500 mt-1">
        Preço Atual: <span class="text-green-500 font-mono">R$ {{ acao?.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
      </p>

      <div class="mt-4 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Quantidade</label>
          <input 
            v-model="quantidade" 
            type="number" 
            class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-500 font-mono"
          />
        </div>

        <div class="space-y-2 pt-1">
          <label class="flex items-center gap-2.5 text-xs font-semibold text-zinc-300 cursor-pointer">
            <input type="radio" value="MERCADO" v-model="tipoOrdem" class="accent-green-500" />
            <span>À Valor de Mercado</span>
          </label>

          <label class="flex items-center gap-2.5 text-xs font-semibold text-zinc-300 cursor-pointer">
            <input type="radio" value="PROGRAMADA" v-model="tipoOrdem" class="accent-green-500" />
            <span>Abaixo de determinado preço</span>
          </label>
        </div>

        <div v-if="tipoOrdem === 'PROGRAMADA'">
          <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Preço Limite</label>
          <input 
            v-model="precoOrdem" 
            type="number" 
            step="0.01"
            placeholder="Ex.: 30,50"
            class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-500 font-mono"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-zinc-900">
        <button 
          @click="emit('fechar')" 
          :disabled="carregando"
          class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button 
          @click="submeterOrdem" 
          :disabled="carregando"
          class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
        >
          {{ carregando ? 'Processando...' : 'Confirmar Compra' }}
        </button>
      </div>

    </div>
  </div>
</template>