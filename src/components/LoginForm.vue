<script setup>
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useValidators } from '@/composables/useValidators'
import { useToast } from '@/composables/useToast'

const emit = defineEmits(['switch-mode', 'success'])
const { login, isLoading, errorMessage, clearMessages } = useAuth()
const { verificaEmailValido, verificaSenhaValida } = useValidators()
const { error: showErrorToast } = useToast()

const showPassword = ref(false)
const form = reactive({
  email: '',
  senha: ''
})

const onSubmit = async () => {
  clearMessages()

  if (!form.email || !form.senha) {
    const msg = 'E-mail e senha são obrigatórios.'
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

  try {
    await login(form.email, form.senha)
    emit('success')
  } catch (err) {
    // Erros de API já disparam toasts e são salvos no useAuth
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="form-content" id="login-form">
    <div class="field">
      <label class="field-label" for="login-email">E-mail</label>
      <div class="input-wrap">
        <span class="input-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </span>
        <input 
          id="login-email"
          type="email" 
          v-model="form.email" 
          placeholder="seu.email@exemplo.com" 
          class="input"
          required
        />
      </div>
    </div>

    <div class="field">
      <div class="field-header">
        <label class="field-label" for="login-password">Senha</label>
        <button 
          type="button" 
          @click="emit('switch-mode', 'recovery')"
          class="link-btn"
          id="forgot-password-btn"
        >
          Esqueceu a senha?
        </button>
      </div>
      <div class="input-wrap">
        <span class="input-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <input 
          id="login-password"
          :type="showPassword ? 'text' : 'password'" 
          v-model="form.senha" 
          placeholder="Insira sua senha" 
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
    </div>

    <button 
      id="login-submit"
      type="submit" 
      :disabled="isLoading"
      class="btn-primary"
    >
      <span v-if="isLoading" class="spinner"></span>
      <span>{{ isLoading ? 'Entrando...' : 'Entrar' }}</span>
    </button>

    <div class="switch-mode">
      <span>Novo por aqui?</span>
      <button type="button" @click="emit('switch-mode', 'register')" class="link-btn" id="switch-to-register">
        Abrir uma conta
      </button>
    </div>
  </form>
</template>
