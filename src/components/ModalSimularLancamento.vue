<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String, // 'deposito' | 'retirada'
    default: 'deposito'
  }
})

const emit = defineEmits(['fechar', 'confirmar'])

const descricao = ref('')
const valor = ref('')
const carregando = ref(false)

// Reset form when modal opens
watch(() => props.mostrar, (val) => {
  if (val) {
    descricao.value = ''
    valor.value = ''
    carregando.value = false
  }
})

const titulo = computed(() =>
  props.tipo === 'deposito' ? 'Simular Depósito' : 'Simular Retirada'
)

const labelValor = computed(() =>
  props.tipo === 'deposito' ? 'Valor do Depósito (R$)' : 'Valor da Retirada (R$)'
)

const corBotao = computed(() =>
  props.tipo === 'deposito'
    ? 'bg-[#00b37e] hover:bg-[#008e63]'
    : 'bg-rose-600 hover:bg-rose-700'
)

const isFormValid = computed(() => {
  const v = parseFloat(valor.value)
  return descricao.value.trim().length > 0 && !isNaN(v) && v > 0
})

const handleConfirmar = () => {
  if (!isFormValid.value || carregando.value) return
  carregando.value = true
  emit('confirmar', {
    descricao: descricao.value.trim(),
    valor: parseFloat(valor.value)
  }, () => {
    carregando.value = false
  })
}

const handleFechar = () => {
  if (carregando.value) return
  emit('fechar')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="mostrar"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleFechar"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="handleFechar" />

        <!-- Modal Card -->
        <div class="relative w-full max-w-md bg-[#0a0f0d] border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

          <!-- Header stripe -->
          <div :class="['h-1 w-full', tipo === 'deposito' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400']" />

          <div class="px-6 py-5">
            <!-- Title Row -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <!-- Deposit icon -->
                <span v-if="tipo === 'deposito'" class="h-9 w-9 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                  <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                  </svg>
                </span>
                <!-- Withdrawal icon -->
                <span v-else class="h-9 w-9 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <svg class="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20V4m0 0l-4 4m4-4l4 4" />
                  </svg>
                </span>
                <h2 class="text-lg font-bold text-white tracking-tight">{{ titulo }}</h2>
              </div>
              <button
                @click="handleFechar"
                class="h-8 w-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleConfirmar" class="flex flex-col gap-4">
              <!-- Descrição -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Descrição</label>
                <input
                  v-model="descricao"
                  type="text"
                  :placeholder="tipo === 'deposito' ? 'Ex: Depósito inicial' : 'Ex: Retirada para conta bancária'"
                  maxlength="120"
                  class="w-full bg-zinc-900/80 border border-zinc-700/60 focus:border-green-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:ring-1 focus:ring-green-500/20"
                  :class="tipo === 'retirada' ? 'focus:border-rose-500/50 focus:ring-rose-500/20' : ''"
                />
              </div>

              <!-- Valor -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ labelValor }}</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium select-none">R$</span>
                  <input
                    v-model="valor"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    class="w-full bg-zinc-900/80 border border-zinc-700/60 focus:border-green-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:ring-1 focus:ring-green-500/20"
                    :class="tipo === 'retirada' ? 'focus:border-rose-500/50 focus:ring-rose-500/20' : ''"
                  />
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 mt-2">
                <button
                  type="button"
                  @click="handleFechar"
                  :disabled="carregando"
                  class="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="!isFormValid || carregando"
                  :class="['flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2', corBotao]"
                >
                  <svg v-if="carregando" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>{{ carregando ? 'Processando...' : 'Confirmar' }}</span>
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Hide number input arrows */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
