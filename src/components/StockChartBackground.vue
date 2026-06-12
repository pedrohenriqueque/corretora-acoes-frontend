<template>
  <div class="chart-bg" aria-hidden="true">
    <svg class="chart-svg" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <!-- Área preenchida sob o gráfico -->
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00ff88" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#00ff88" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00c44f" />
          <stop offset="100%" stop-color="#00ff88" />
        </linearGradient>
        <!-- Grid lines horizontal -->
        <pattern id="hgrid" width="1440" height="70" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="1440" y2="0" stroke="rgba(0,255,100,0.05)" stroke-width="1"/>
        </pattern>
        <!-- Grid lines vertical -->
        <pattern id="vgrid" width="120" height="560" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="560" stroke="rgba(0,255,100,0.04)" stroke-width="1"/>
        </pattern>
      </defs>

      <!-- Grid -->
      <rect width="1440" height="560" fill="url(#hgrid)" />
      <rect width="1440" height="560" fill="url(#vgrid)" />

      <!-- Área preenchida -->
      <path class="chart-area"
        d="M0,520
           L60,510 L120,495 L180,488 L240,470 L300,462 L360,445 L420,430 L480,418
           L540,400 L600,385 L660,368 L720,348 L780,330 L840,308 L900,285
           L960,260 L1020,238 L1080,215 L1140,192 L1200,168 L1260,145 L1320,118 L1380,90 L1440,60
           L1440,560 L0,560 Z"
        fill="url(#chartFill)" />

      <!-- Linha principal do gráfico -->
      <path class="chart-line"
        d="M0,520
           L60,510 L120,495 L180,488 L240,470 L300,462 L360,445 L420,430 L480,418
           L540,400 L600,385 L660,368 L720,348 L780,330 L840,308 L900,285
           L960,260 L1020,238 L1080,215 L1140,192 L1200,168 L1260,145 L1320,118 L1380,90 L1440,60"
        fill="none"
        stroke="url(#chartLine)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round" />

      <!-- Velas candlestick decorativas -->
      <!-- Candles verdes (alta) -->
      <rect x="60"   y="490" width="10" height="25" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="65"  y1="487" x2="65"  y2="518" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="180"  y="468" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="185" y1="465" x2="185" y2="492" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="300"  y="443" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="305" y1="440" x2="305" y2="467" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="420"  y="412" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="425" y1="408" x2="425" y2="436" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="540"  y="382" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="545" y1="378" x2="545" y2="406" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="660"  y="350" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="665" y1="346" x2="665" y2="374" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="780"  y="313" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="785" y1="309" x2="785" y2="337" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="900"  y="268" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="905" y1="264" x2="905" y2="292" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="1020" y="220" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="1025" y1="216" x2="1025" y2="244" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="1140" y="175" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="1145" y1="171" x2="1145" y2="199" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="1260" y="128" width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="1265" y1="124" x2="1265" y2="152" stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>
      <rect x="1380" y="75"  width="10" height="22" rx="1" fill="#00c44f" opacity="0.6"/>
      <line x1="1385" y1="71"  x2="1385" y2="99"  stroke="#00c44f" stroke-width="1.5" opacity="0.6"/>

      <!-- Candles vermelhos (pequenas correções) -->
      <rect x="120"  y="492" width="10" height="14" rx="1" fill="#ff4d6a" opacity="0.5"/>
      <line x1="125" y1="489" x2="125" y2="508" stroke="#ff4d6a" stroke-width="1.5" opacity="0.5"/>
      <rect x="480"  y="415" width="10" height="12" rx="1" fill="#ff4d6a" opacity="0.5"/>
      <line x1="485" y1="412" x2="485" y2="429" stroke="#ff4d6a" stroke-width="1.5" opacity="0.5"/>
      <rect x="840"  y="306" width="10" height="12" rx="1" fill="#ff4d6a" opacity="0.5"/>
      <line x1="845" y1="303" x2="845" y2="320" stroke="#ff4d6a" stroke-width="1.5" opacity="0.5"/>
      <rect x="1200" y="165" width="10" height="12" rx="1" fill="#ff4d6a" opacity="0.5"/>
      <line x1="1205" y1="162" x2="1205" y2="179" stroke="#ff4d6a" stroke-width="1.5" opacity="0.5"/>

      <!-- Ponto de destaque no topo (último preço) -->
      <circle class="pulse-dot" cx="1440" cy="60" r="6" fill="#00ff88" />
      <circle cx="1440" cy="60" r="3" fill="#ffffff" />

      <!-- Labels de preço à direita -->
      <text x="10" y="530" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">23.400</text>
      <text x="10" y="460" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">27.800</text>
      <text x="10" y="390" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">32.200</text>
      <text x="10" y="320" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">36.600</text>
      <text x="10" y="250" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">41.000</text>
      <text x="10" y="180" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">45.400</text>
      <text x="10" y="110" font-size="10" fill="rgba(0,255,100,0.3)" font-family="monospace">49.800</text>
      <text x="10" y="70"  font-size="10" fill="rgba(0,255,136,0.6)" font-family="monospace" font-weight="bold">▲ 54.120</text>
    </svg>

    <!-- Overlay escuro suave para não competir com o card -->
    <div class="chart-overlay"></div>
  </div>
</template>

<style scoped>
.chart-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.chart-svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chart-line {
  stroke-dasharray: 3000;
  stroke-dashoffset: 3000;
  animation: draw-line 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.chart-area {
  opacity: 0;
  animation: fade-area 1.5s ease forwards 3.2s;
}

.pulse-dot {
  opacity: 0;
  animation: pulse-appear 0.6s ease forwards 3.8s,
             pulse-glow 2s ease-in-out infinite 4.4s;
}

@keyframes draw-line {
  from { stroke-dashoffset: 3000; }
  to   { stroke-dashoffset: 0; }
}

@keyframes fade-area {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes pulse-appear {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes pulse-glow {
  0%, 100% { r: 6; opacity: 1; }
  50%       { r: 9; opacity: 0.5; }
}

.chart-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 80% at 50% 50%,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.4) 60%,
    rgba(0, 0, 0, 0.1) 100%
  );
}
</style>
