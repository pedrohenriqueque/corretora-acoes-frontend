import { ref } from 'vue'
import { authService } from '@/services/authService'
import { useToast } from '@/composables/useToast'

// Estado Compartilhado Global (Singleton)
const user = ref(null)
const token = ref(localStorage.getItem('token') || null)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Tenta inicializar o usuário a partir do localStorage
try {
  const storedUser = localStorage.getItem('usuario')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
} catch (e) {
  console.error('Falha ao parsear usuário armazenado:', e)
}

export function useAuth() {
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
  }

  const login = async (email, senha) => {
    clearMessages()
    isLoading.value = true
    try {
      const response = await authService.login(email, senha)
      
      token.value = response.data.token
      localStorage.setItem('token', response.data.token)
      
      if (response.data.usuario) {
        user.value = response.data.usuario
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
      } else {
        user.value = { email }
        localStorage.setItem('usuario', JSON.stringify({ email }))
      }

      const msg = response.data.message || 'Login bem-sucedido!'
      successMessage.value = msg
      showSuccessToast(msg)
      return response.data
    } catch (err) {
      const errMsg = err.response?.data?.error || 'E-mail ou senha incorretos.'
      errorMessage.value = errMsg
      showErrorToast(errMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (nome, email, senha, senhaRepetida) => {
    clearMessages()
    isLoading.value = true
    try {
      const response = await authService.register(nome, email, senha, senhaRepetida)
      const msg = response.data.message || 'Conta aberta com sucesso! Redirecionando para login...'
      successMessage.value = msg
      showSuccessToast(msg)
      return response.data
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Ocorreu um erro ao abrir sua conta.'
      errorMessage.value = errMsg
      showErrorToast(errMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const requestRecoveryCode = async (email) => {
    clearMessages()
    isLoading.value = true
    try {
      const response = await authService.requestRecoveryCode(email)
      const msg = response.data.message || 'Se o e-mail constar em nossa base, o código de verificação foi enviado.'
      successMessage.value = msg
      showSuccessToast(msg)
      return response.data
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Erro ao processar a solicitação de recuperação.'
      errorMessage.value = errMsg
      showErrorToast(errMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (email, codigo, novaSenha, senhaRepetida) => {
    clearMessages()
    isLoading.value = true
    try {
      const response = await authService.resetPassword(email, codigo, novaSenha, senhaRepetida)
      const msg = response.data.message || 'Senha redefinida com sucesso!'
      successMessage.value = msg
      showSuccessToast(msg)
      return response.data
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Erro ao redefinir a senha.'
      errorMessage.value = errMsg
      showErrorToast(errMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    showSuccessToast('Sessão encerrada com sucesso.')
  }

  return {
    user,
    token,
    isLoading,
    errorMessage,
    successMessage,
    clearMessages,
    login,
    register,
    requestRecoveryCode,
    resetPassword,
    logout
  }
}

