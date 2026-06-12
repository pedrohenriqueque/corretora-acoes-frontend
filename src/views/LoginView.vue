<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import StockChartBackground from '@/components/StockChartBackground.vue'
import TickerStrip from '@/components/TickerStrip.vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import RecoveryForm from '@/components/RecoveryForm.vue'

const router = useRouter()
const mode = ref('login') // 'login' | 'register' | 'recovery'
const { errorMessage, successMessage, clearMessages } = useAuth()

const switchMode = (newMode) => {
  clearMessages()
  mode.value = newMode
}

const onLoginSuccess = () => {
  setTimeout(() => {
    router.push('/mercado')
  }, 1200)
}
</script>

<template>
  <div class="login-page">
    <StockChartBackground />
    <TickerStrip />

    <div class="login-container">
      <!-- Logo / Branding -->
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <h1 class="brand-name">BolsaSim</h1>
        <p class="brand-tagline">Sua corretora digital de investimentos</p>
      </div>

      <!-- Card principal -->
      <div class="card">
        <!-- Alerta de Erro -->
        <div v-if="errorMessage" class="alert alert--error">
          <svg class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Alerta de Sucesso -->
        <div v-if="successMessage" class="alert alert--success">
          <svg class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Componentes Dinâmicos do Formulário -->
        <LoginForm 
          v-if="mode === 'login'" 
          @switch-mode="switchMode" 
          @success="onLoginSuccess" 
        />
        <RegisterForm 
          v-else-if="mode === 'register'" 
          @switch-mode="switchMode" 
        />
        <RecoveryForm 
          v-else-if="mode === 'recovery'" 
          @switch-mode="switchMode" 
        />
      </div>

      <!-- Footer -->
      <p class="footer">&copy; 2026 BolsaSim — Plataforma de Investimentos</p>
    </div>
  </div>
</template>

<style>
/* ── Estilos Globais / Compartilhados de Layout e Form (Globais para as Views/Componentes carregados) ── */

/* ── Page Layout ───────────────────────────────── */
.login-page {
  min-height: 100vh;
  background: #000000;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Login Container ───────────────────────────── */
.login-container {
  width: 100%;
  max-width: 410px;
  position: relative;
  z-index: 10;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
}

/* ── Brand / Header ────────────────────────────── */
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.brand-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00d97e, #00844a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 0 28px rgba(0, 217, 126, 0.35), 0 8px 20px rgba(0, 0, 0, 0.4);
  margin-bottom: 14px;
}

.brand-icon svg {
  width: 26px;
  height: 26px;
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff 30%, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.brand-tagline {
  font-size: 13px;
  color: #7a9e82;
  margin: 5px 0 0 0;
}

/* ── Card ──────────────────────────────────────── */
.card {
  background: rgba(5, 7, 5, 0.82);
  border: 1px solid rgba(0, 255, 100, 0.1);
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 24px 48px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(0, 200, 80, 0.05);
  backdrop-filter: blur(20px);
}

/* ── Form ──────────────────────────────────────── */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7ecf96;
}

.field-hint {
  font-size: 10px;
  color: #5a9a6e;
  line-height: 1.4;
  margin: 2px 0 0 0;
}

/* ── Inputs ────────────────────────────────────── */
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 13px;
  color: #5a9a6e;
  display: flex;
  align-items: center;
}

.input-icon svg {
  width: 17px;
  height: 17px;
}

.input {
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 255, 100, 0.15);
  border-radius: 10px;
  padding: 12px 16px 12px 40px;
  font-size: 13.5px;
  color: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.input::placeholder {
  color: #4a7a56;
}

.input:focus {
  outline: none;
  border-color: rgba(0, 217, 126, 0.5);
  box-shadow: 0 0 0 3px rgba(0, 217, 126, 0.1);
  background: rgba(0, 8, 0, 0.7);
}

.input--pin {
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  letter-spacing: 6px;
  padding-left: 16px;
}

/* ── Eye Button ────────────────────────────────── */
.eye-btn {
  position: absolute;
  right: 13px;
  background: none;
  border: none;
  color: #5a9a6e;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.eye-btn:hover { color: #00d97e; }
.eye-btn svg { width: 17px; height: 17px; }

/* ── Primary Button ────────────────────────────── */
.btn-primary {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #00d97e 0%, #00844a 100%);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(0, 217, 126, 0.25);
  transition: all 0.2s ease;
  margin-top: 6px;
  letter-spacing: 0.3px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #00ff96 0%, #00a85e 100%);
  box-shadow: 0 6px 20px rgba(0, 217, 126, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active { transform: translateY(0) scale(0.99); }
.btn-primary:disabled { opacity: 0.45; pointer-events: none; }

/* ── Spinner ───────────────────────────────────── */
.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Link Buttons ──────────────────────────────── */
.link-btn {
  background: none;
  border: none;
  color: #00d97e;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}

.link-btn:hover {
  color: #00ff96;
  text-decoration: underline;
}

/* ── Switch Mode ───────────────────────────────── */
.switch-mode {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #7a9e82;
  margin-top: 10px;
}

/* ── Alerts ────────────────────────────────────── */
.alert {
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 12.5px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  line-height: 1.45;
}

.alert-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  margin-top: 1px;
}

.alert--error {
  background: rgba(255, 77, 106, 0.07);
  border: 1px solid rgba(255, 77, 106, 0.2);
  color: #ff7a94;
}

.alert--success {
  background: rgba(0, 217, 126, 0.07);
  border: 1px solid rgba(0, 217, 126, 0.2);
  color: #00d97e;
}

/* ── Recovery ──────────────────────────────────── */
.recovery-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.back-btn {
  background: none;
  border: none;
  color: #5a9a6e;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.back-btn:hover {
  color: #e2e8f0;
  background: rgba(0, 217, 126, 0.1);
}

.back-btn svg { width: 18px; height: 18px; }

.recovery-title {
  font-size: 15px;
  font-weight: 700;
  color: #e8f5e9;
  margin: 0;
}

.recovery-step {
  font-size: 11px;
  color: #6aaa7e;
  margin: 2px 0 0 0;
}

.recovery-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Footer ────────────────────────────────────── */
.footer {
  text-align: center;
  font-size: 11px;
  color: #4a7a56;
  margin-top: 20px;
}
</style>
