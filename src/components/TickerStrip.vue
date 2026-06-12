<template>
  <div class="ticker-strip">
    <div class="ticker-track">
      <span class="ticker-item ticker-up">PETR4 <small>+1.42%</small></span>
      <span class="ticker-item ticker-down">VALE3 <small>−0.87%</small></span>
      <span class="ticker-item ticker-up">ITUB4 <small>+0.63%</small></span>
      <span class="ticker-item ticker-down">BBDC4 <small>−0.31%</small></span>
      <span class="ticker-item ticker-up">WEGE3 <small>+2.05%</small></span>
      <span class="ticker-item ticker-up">ABEV3 <small>+0.19%</small></span>
      <span class="ticker-item ticker-down">MGLU3 <small>−3.12%</small></span>
      <span class="ticker-item ticker-up">B3SA3 <small>+0.74%</small></span>
      <span class="ticker-item ticker-up">RENT3 <small>+1.10%</small></span>
      <span class="ticker-item ticker-down">SUZB3 <small>−0.55%</small></span>
      <!-- Duplicado para loop contínuo -->
      <span class="ticker-item ticker-up">PETR4 <small>+1.42%</small></span>
      <span class="ticker-item ticker-down">VALE3 <small>−0.87%</small></span>
      <span class="ticker-item ticker-up">ITUB4 <small>+0.63%</small></span>
      <span class="ticker-item ticker-down">BBDC4 <small>−0.31%</small></span>
      <span class="ticker-item ticker-up">WEGE3 <small>+2.05%</small></span>
      <span class="ticker-item ticker-up">ABEV3 <small>+0.19%</small></span>
      <span class="ticker-item ticker-down">MGLU3 <small>−3.12%</small></span>
      <span class="ticker-item ticker-up">B3SA3 <small>+0.74%</small></span>
      <span class="ticker-item ticker-up">RENT3 <small>+1.10%</small></span>
      <span class="ticker-item ticker-down">SUZB3 <small>−0.55%</small></span>
    </div>
  </div>
</template>

<style scoped>
.ticker-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
  background: rgba(4, 8, 4, 0.8);
  border-bottom: 1px solid rgba(34, 197, 94, 0.08);
  backdrop-filter: blur(8px);
  overflow: hidden;
  display: flex;
  align-items: center;
  z-index: 40;
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-animation 35s linear infinite;
}

.ticker-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 0 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.ticker-up   { color: #4ade80; }
.ticker-down { color: #f87171; }
.ticker-item small { opacity: 0.8; }

@keyframes ticker-animation {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
