<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useValidators } from '@/composables/useValidators'
import FooterComponent from '@/components/FooterComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const router = useRouter()
const { token } = useAuth()
const { verificaSenhaValida } = useValidators()

const carregando = ref(false)
const mensagemSucesso = ref('')
const mensagemErro = ref('')

// Estados para controlar a visibilidade de cada campo individualmente
const verSenhaAtual = ref(false)
const verNovaSenha = ref(false)
const verNovaSenhaRepetida = ref(false)

const form = reactive({
  senhaAtual: '',
  novaSenha: '',
  novaSenhaRepetida: ''
})

const handleAlterarSenha = async () => {
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  if (!form.senhaAtual || !form.novaSenha || !form.novaSenhaRepetida) {
    mensagemErro.value = 'Todos os campos de senha são obrigatórios.'
    return
  }

  if (form.novaSenha !== form.novaSenhaRepetida) {
    mensagemErro.value = 'A confirmação da nova senha não confere.'
    return
  }

  if (!verificaSenhaValida(form.novaSenha)) {
    mensagemErro.value = 'A nova senha deve conter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
    return
  }

  carregando.value = true

  try {
    const config = { headers: { Authorization: `Bearer ${token.value}` } }
    const response = await axios.post('http://localhost:3000/auth/trocar-senha', form, config)
    
    mensagemSucesso.value = response.data.message || 'Senha alterada com sucesso!'
    
    form.senhaAtual = ''
    form.novaSenha = ''
    form.novaSenhaRepetida = ''
    
    setTimeout(() => {
      router.push('/mercado')
    }, 2000)
  } catch (error) {
    mensagemErro.value = error.response?.data?.error || 'Erro ao processar a troca de senha.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col justify-between font-sans antialiased">
    <HeaderComponent />

    <main class="max-w-md mx-auto px-6 py-12 flex-grow w-full flex flex-col justify-center">
      <div class="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl">
        <div class="mb-6">
          <h2 class="text-xl font-bold tracking-tight text-zinc-200">Segurança da Conta</h2>
          <p class="text-xs text-zinc-500 mt-1">Atualize sua senha de acesso periodicamente para manter sua carteira segura.</p>
        </div>

        <div v-if="mensagemErro" class="mb-4 p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded-lg font-medium">
          {{ mensagemErro }}
        </div>
        <div v-if="mensagemSucesso" class="mb-4 p-3 bg-green-950/40 border border-green-900 text-green-400 text-xs rounded-lg font-medium">
          {{ mensagemSucesso }}
        </div>

        <form @submit.prevent="handleAlterarSenha" class="space-y-4">
          
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Senha Atual</label>
            <div class="relative flex items-center">
              <input 
                v-model="form.senhaAtual" 
                :type="verSenhaAtual ? 'text' : 'password'" 
                placeholder="Digite sua senha atual" 
                class="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-500"
                required
              />
              <button 
                type="button" 
                @click="verSenhaAtual = !verSenhaAtual"
                class="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center"
              >
                <svg v-if="verSenhaAtual" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Nova Senha</label>
            <div class="relative flex items-center">
              <input 
                v-model="form.novaSenha" 
                :type="verNovaSenha ? 'text' : 'password'" 
                placeholder="Mínimo 8 caracteres" 
                class="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-500"
                required
              />
              <button 
                type="button" 
                @click="verNovaSenha = !verNovaSenha"
                class="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center"
              >
                <svg v-if="verNovaSenha" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              </button>
            </div>
            <p class="text-[10px] text-zinc-500 mt-1">Deve conter letras maiúsculas, minúsculas, números e caracteres especiais.</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Confirmar Nova Senha</label>
            <div class="relative flex items-center">
              <input 
                v-model="form.novaSenhaRepetida" 
                :type="verNovaSenhaRepetida ? 'text' : 'password'" 
                placeholder="Repita a nova senha" 
                class="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-500"
                required
              />
              <button 
                type="button" 
                @click="verNovaSenhaRepetida = !verNovaSenhaRepetida"
                class="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center"
              >
                <svg v-if="verNovaSenhaRepetida" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <router-link to="/mercado" class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors text-center decoration-none">
              Voltar
            </router-link>
            <button 
              type="submit" 
              :disabled="carregando"
              class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {{ carregando ? 'Salvando...' : 'Salvar Nova Senha' }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>