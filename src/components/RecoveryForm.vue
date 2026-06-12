<script setup>
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useValidators } from '@/composables/useValidators'
import { useToast } from '@/composables/useToast'

const emit = defineEmits(['switch-mode'])
const { requestRecoveryCode, resetPassword, isLoading, errorMessage, clearMessages } = useAuth()
const { verificaEmailValido, verificaSenhaValida } = useValidators()
const { error: showErrorToast } = useToast()

const recoveryStep = ref(1)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  email: '',
  codigo: '',
  novaSenha: '',
  senhaRepetida: ''
})

const onStep1Submit = async () => {
  clearMessages()

  if (!form.email) {
    const msg = 'O e-mail é obrigatório.'
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

  try {
    await requestRecoveryCode(form.email)
    // Se bem-sucedido, avançamos para o step 2 após um pequeno delay para a mensagem ser lida
    setTimeout(() => {
      recoveryStep.value = 2
      clearMessages()
    }, 1500)
  } catch (err) {
    // Tratado pelo useAuth
  }
}

const onStep2Submit = async () => {
  clearMessages()

  if (!form.email || !form.codigo || !form.novaSenha || !form.senhaRepetida) {
    const msg = 'Código, nova senha e confirmação de senha são obrigatórios.'
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

  if (form.novaSenha !== form.senhaRepetida) {
    const msg = 'A confirmação de senha está diferente da nova senha.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  if (!verificaSenhaValida(form.novaSenha)) {
    const msg = 'A nova senha deve conter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
    errorMessage.value = msg
    showErrorToast(msg)
    return
  }

  try {
    await resetPassword(form.email, form.codigo, form.novaSenha, form.senhaRepetida)
    // Se bem-sucedido, retornamos ao login após o delay
    setTimeout(() => {
      emit('switch-mode', 'login')
    }, 1500)
  } catch (err) {
    // Tratado pelo useAuth
  }
}
</script>

<template>
  <div class="form-content">
    <div class="recovery-header">
      <button 
        type="button" 
        @click="emit('switch-mode', 'login')"
        class="back-btn"
        id="recovery-back-btn"
        aria-label="Voltar para o Login"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div>
        <h3 class="recovery-title">Recuperar Senha</h3>
        <p class="recovery-step">Etapa {{ recoveryStep }} de 2</p>
      </div>
    </div>

    <!-- ETAPA 1: SOLICITAR CÓDIGO -->
    <form v-if="recoveryStep === 1" @submit.prevent="onStep1Submit" class="recovery-form" id="recovery-step1-form">
      <p class="field-hint" style="margin-bottom: 12px;">
        Informe o e-mail cadastrado. Enviaremos um código PIN de 6 dígitos para verificação.
      </p>
      
      <div class="field">
        <label class="field-label" for="recovery-email">E-mail</label>
        <div class="input-wrap">
          <span class="input-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </span>
          <input 
            id="recovery-email"
            type="email" 
            v-model="form.email" 
            placeholder="seu.email@exemplo.com" 
            class="input"
            required
          />
        </div>
      </div>

      <button 
        id="recovery-step1-submit"
        type="submit" 
        :disabled="isLoading"
        class="btn-primary"
      >
        <span v-if="isLoading" class="spinner"></span>
        <span>{{ isLoading ? 'Solicitando...' : 'Solicitar Código' }}</span>
      </button>

      <div class="switch-mode">
        <button 
          type="button" 
          @click="recoveryStep = 2; clearMessages()"
          class="link-btn"
          id="already-have-pin-btn"
        >
          Já possuo um código PIN
        </button>
      </div>
    </form>

    <!-- ETAPA 2: REDEFINIR SENHA COM PIN -->
    <form v-else-if="recoveryStep === 2" @submit.prevent="onStep2Submit" class="recovery-form" id="recovery-step2-form">
      <p class="field-hint" style="margin-bottom: 12px;">
        Insira o código PIN de 6 dígitos enviado ao seu e-mail e escolha sua nova senha.
      </p>

      <div class="field">
        <label class="field-label" for="recovery-step2-email">E-mail</label>
        <div class="input-wrap">
          <span class="input-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </span>
          <input 
            id="recovery-step2-email"
            type="email" 
            v-model="form.email" 
            placeholder="seu.email@exemplo.com" 
            class="input"
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="field-label" for="recovery-pin">Código de Verificação PIN</label>
        <div class="input-wrap">
          <span class="input-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <input 
            id="recovery-pin"
            type="text" 
            v-model="form.codigo" 
            placeholder="000000" 
            maxlength="6"
            class="input input--pin"
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="field-label" for="recovery-new-password">Nova Senha</label>
        <div class="input-wrap">
          <span class="input-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input 
            id="recovery-new-password"
            :type="showNewPassword ? 'text' : 'password'" 
            v-model="form.novaSenha" 
            placeholder="Mínimo 8 caracteres" 
            class="input"
            required
          />
          <button 
            type="button" 
            @click="showNewPassword = !showNewPassword"
            class="eye-btn"
            aria-label="Alternar visibilidade da nova senha"
          >
            <svg v-if="showNewPassword" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <label class="field-label" for="recovery-confirm-password">Confirmar Nova Senha</label>
        <div class="input-wrap">
          <span class="input-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input 
            id="recovery-confirm-password"
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="form.senhaRepetida" 
            placeholder="Confirme sua nova senha" 
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
        id="recovery-step2-submit"
        type="submit" 
        :disabled="isLoading"
        class="btn-primary"
      >
        <span v-if="isLoading" class="spinner"></span>
        <span>{{ isLoading ? 'Redefinindo...' : 'Confirmar e Alterar' }}</span>
      </button>

      <div class="switch-mode">
        <button 
          type="button" 
          @click="recoveryStep = 1; clearMessages()"
          class="link-btn"
          id="back-to-step1-btn"
        >
          Voltar à etapa 1
        </button>
      </div>
    </form>
  </div>
</template>
