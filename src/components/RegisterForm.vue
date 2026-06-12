<script setup>
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useValidators } from '@/composables/useValidators'
import { useToast } from '@/composables/useToast'

const emit = defineEmits(['switch-mode'])
const { register, isLoading, errorMessage, clearMessages } = useAuth()
const { verificaEmailValido, verificaSenhaValida } = useValidators()
const { error: showErrorToast } = useToast()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  nome: '',
  email: '',
  senha: '',
  senhaRepetida: ''
})

const onSubmit = async () => {
  clearMessages()

  if (!form.nome || !form.email || !form.senha || !form.senhaRepetida) {
    const msg = 'Nome, e-mail, senha e confirmação são obrigatórios.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  if (form.nome.trim().length === 0) {
    const msg = 'O nome do usuário não pode ser vazio.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  if (!verificaEmailValido(form.email)) {
    const msg = 'O e-mail do usuário não está em um formato adequado.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  if (!verificaSenhaValida(form.senha)) {
    const msg = 'A senha deve conter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  if (form.senha !== form.senhaRepetida) {
    const msg = 'A confirmação de senha está diferente da senha.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  try {
    await register(form.nome, form.email, form.senha, form.senhaRepetida)
  } catch (err) {
    // Tratado pelo useAuth
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="form-content" id="register-form">
    <div class="field">
      <label class="field-label" for="register-name">Nome Completo</label>
      <div class="input-wrap">
        <span class="input-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <input 
          id="register-name"
          type="text" 
          v-model="form.nome" 
          placeholder="Ex: João Silva" 
          class="input"
          required
        />
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="register-email">E-mail</label>
      <div class="input-wrap">
        <span class="input-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </span>
        <input 
          id="register-email"
          type="email" 
          v-model="form.email" 
          placeholder="seu.email@exemplo.com" 
          class="input"
          required
        />
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="register-password">Senha</label>
      <div class="input-wrap">
        <span class="input-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <input 
          id="register-password"
          :type="showPassword ? 'text' : 'password'" 
          v-model="form.senha" 
          placeholder="Mínimo 8 caracteres" 
          class="input"
          required
        />
        <button 
          type="button" 
          @click="showPassword = !showPassword"
          class="eye-btn"
          aria-label="Alternar visibilidade da senha"
        >
          <svg v-if="showPassword" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
        </button>
      </div>
      <p class="field-hint">Letras maiúsculas, minúsculas, números e caracteres especiais.</p>
    </div>

    <div class="field">
      <label class="field-label" for="register-confirm-password">Confirmar Senha</label>
      <div class="input-wrap">
        <span class="input-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <input 
          id="register-confirm-password"
          :type="showConfirmPassword ? 'text' : 'password'" 
          v-model="form.senhaRepetida" 
          placeholder="Repita sua senha" 
          class="input"
          required
        />
        <button 
          type="button" 
          @click="showConfirmPassword = !showConfirmPassword"
          class="eye-btn"
          aria-label="Alternar visibilidade da confirmação de senha"
        >
          <svg v-if="showConfirmPassword" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
        </button>
      </div>
    </div>

    <button 
      id="register-submit"
      type="submit" 
      :disabled="isLoading"
      class="btn-primary"
    >
      <span v-if="isLoading" class="spinner"></span>
      <span>{{ isLoading ? 'Criando Conta...' : 'Abrir Conta' }}</span>
    </button>

    <div class="switch-mode">
      <span>Já tem uma conta?</span>
      <button type="button" @click="emit('switch-mode', 'login')" class="link-btn" id="switch-to-login">
        Fazer Login
      </button>
    </div>
  </form>
</template>
