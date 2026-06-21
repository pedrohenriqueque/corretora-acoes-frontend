<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  mostrar: { type: Boolean, required: true },
  posicao: { type: Object, default: null } // PosicaoCarteira: { codigo, preco, quantidade, preco_medio, ganho_perda }
})

const emit = defineEmits(['fechar', 'confirmar'])

const quantidade = ref(1)
const tipoOrdem = ref('MERCADO')
const precoOrdem = ref('')
const carregando = ref(false)

watch(() => props.mostrar, (visivel) => {
  if (visivel) {
    quantidade.value = 1
    tipoOrdem.value = 'MERCADO'
    precoOrdem.value = ''
    carregando.value = false
  }
})

const isFormValid = computed(() => {
  const q = Number(quantidade.value)
  if (!q || q < 1 || q > (props.posicao?.quantidade ?? 0)) return false
  if (tipoOrdem.value === 'PROGRAMADA') {
    const p = Number(precoOrdem.value)
    return !isNaN(p) && p > 0
  }
  return true
})

const formatarMoeda = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v ?? 0)

const submeterOrdem = () => {
  if (!isFormValid.value || carregando.value) return
  carregando.value = true
  const payload = {
    codigo: props.posicao.codigo,
    quantidade: Number(quantidade.value),
    tipoOrdem: tipoOrdem.value,
    ...(tipoOrdem.value === 'PROGRAMADA' && { precoOrdem: Number(precoOrdem.value) })
  }
  emit('confirmar', payload, () => { carregando.value = false })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="mostrar"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('fechar')"
      >
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="emit('fechar')" />

        <div class="relative w-full max-w-sm bg-[#0a0f0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Top accent bar -->
          <div class="h-1 w-full bg-gradient-to-r from-rose-500 to-rose-400" />

          <div class="px-6 py-5">
            <!-- Header -->
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <span class="h-9 w-9 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <svg class="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20V4m0 0l-4 4m4-4l4 4" />
                  </svg>
                </span>
                <div>
                  <h3 class="text-base font-bold text-white">Vender {{ posicao?.codigo }}</h3>
                  <p class="text-xs text-zinc-500">Preço atual: <span class="font-mono text-zinc-300">{{ formatarMoeda(posicao?.preco) }}</span></p>
                </div>
              </div>
              <button @click="emit('fechar')" class="h-8 w-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Info row -->
            <div class="grid grid-cols-2 gap-3 mb-5">
              <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
                <p class="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Disponível</p>
                <p class="text-base font-bold font-mono text-white">{{ posicao?.quantidade ?? 0 }}</p>
              </div>
              <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
                <p class="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Preço Médio</p>
                <p class="text-base font-bold font-mono text-white">{{ formatarMoeda(posicao?.preco_medio) }}</p>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="submeterOrdem" class="flex flex-col gap-4">
              <!-- Quantidade -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quantidade</label>
                <input
                  v-model="quantidade"
                  type="number"
                  min="1"
                  :max="posicao?.quantidade"
                  class="w-full bg-zinc-900/80 border border-zinc-700/60 focus:border-rose-500/50 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-all focus:ring-1 focus:ring-rose-500/20"
                />
                <p v-if="Number(quantidade) > (posicao?.quantidade ?? 0)" class="text-xs text-rose-400">
                  Quantidade maior que a disponível ({{ posicao?.quantidade }})
                </p>
              </div>

              <!-- Tipo Ordem -->
              <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tipo de Ordem</label>
                <label class="flex items-center gap-2.5 text-xs font-medium text-zinc-300 cursor-pointer">
                  <input type="radio" value="MERCADO" v-model="tipoOrdem" class="accent-rose-500" />
                  <span>À Valor de Mercado</span>
                </label>
                <label class="flex items-center gap-2.5 text-xs font-medium text-zinc-300 cursor-pointer">
                  <input type="radio" value="PROGRAMADA" v-model="tipoOrdem" class="accent-rose-500" />
                  <span>Acima de determinado preço</span>
                </label>
              </div>

              <!-- Preço limite (PROGRAMADA) -->
              <div v-if="tipoOrdem === 'PROGRAMADA'" class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Preço Limite (R$)</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium select-none">R$</span>
                  <input
                    v-model="precoOrdem"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    class="w-full bg-zinc-900/80 border border-zinc-700/60 focus:border-rose-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none transition-all focus:ring-1 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 mt-1">
                <button type="button" @click="emit('fechar')" :disabled="carregando"
                  class="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl border border-zinc-700 transition-all cursor-pointer disabled:opacity-50">
                  Cancelar
                </button>
                <button type="submit" :disabled="!isFormValid || carregando"
                  class="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <svg v-if="carregando" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ carregando ? 'Processando...' : 'Confirmar Venda' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
</style>
