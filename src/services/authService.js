import api from './api'

export const authService = {
  login(email, senha) {
    return api.post('/auth/login', { email, senha })
  },

  register(nome, email, senha, senhaRepetida) {
    return api.post('/auth/register', { nome, email, senha, senhaRepetida })
  },

  requestRecoveryCode(email) {
    return api.post('/auth/recuperar-senha', { email })
  },

  resetPassword(email, codigo, novaSenha, senhaRepetida) {
    return api.post('/auth/recuperar-senha', { email, codigo, novaSenha, senhaRepetida })
  }
}
