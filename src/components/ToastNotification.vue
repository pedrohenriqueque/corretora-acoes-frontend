<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="['toast-item', `toast-item--${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <!-- Ícone correspondente ao tipo -->
        <span class="toast-icon">
          <!-- Sucesso: Círculo com check -->
          <svg v-if="toast.type === 'success'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Erro: Círculo com exclamação -->
          <svg v-else-if="toast.type === 'error'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Info: Círculo com info -->
          <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>

        <span class="toast-message">{{ toast.message }}</span>

        <button class="toast-close" @click.stop="removeToast(toast.id)">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 50px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 99999;
  pointer-events: none;
  max-width: 380px;
  width: calc(100% - 48px);
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  cursor: pointer;
  position: relative;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Tipos de Toast */
.toast-item--success {
  background: rgba(5, 12, 5, 0.85);
  border: 1px solid rgba(0, 217, 126, 0.3);
  color: #00d97e;
  box-shadow: 0 10px 30px rgba(0, 217, 126, 0.08);
}

.toast-item--error {
  background: rgba(15, 5, 5, 0.85);
  border: 1px solid rgba(255, 77, 106, 0.3);
  color: #ff7a94;
  box-shadow: 0 10px 30px rgba(255, 77, 106, 0.08);
}

.toast-item--info {
  background: rgba(5, 8, 12, 0.85);
  border: 1px solid rgba(0, 150, 255, 0.3);
  color: #00c0ff;
  box-shadow: 0 10px 30px rgba(0, 150, 255, 0.08);
}

/* Ícones */
.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon svg {
  width: 20px;
  height: 20px;
}

/* Mensagem */
.toast-message {
  flex-grow: 1;
  line-height: 1.4;
  word-break: break-word;
}

/* Botão Fechar */
.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}

.toast-close:hover {
  opacity: 1;
}

/* Transições da Lista de Toasts (Vue TransitionGroup) */
.toast-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-leave-active {
  position: absolute;
}
</style>
