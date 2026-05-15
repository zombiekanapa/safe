@import "tailwindcss";

@theme {
  --font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  
  --color-bg: #0A0A0A;
  --color-surface: #1A1A1A;
  --color-accent: #FFD700;
  --color-danger: #FF3E3E;
  --color-safe: #00FF66;
  --color-text: #FFFFFF;
}

@layer base {
  body {
    @apply font-sans antialiased bg-bg text-text transition-colors duration-300 font-bold uppercase;
  }
}

.high-contrast {
  /* The Bold Typography theme is already high contrast/dark by default */
  @apply bg-black text-white;
}

.emergency-btn {
  @apply bg-accent text-black font-black px-6 py-3 border-none hover:bg-white hover:scale-[1.02] transition-all cursor-pointer uppercase tracking-tight;
}

.map-container {
  @apply w-full h-full relative bg-[#111];
  background-image: 
    linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
    repeating-linear-gradient(0deg, #222 0, #222 1px, transparent 1px, transparent 40px),
    repeating-linear-gradient(90deg, #222 0, #222 1px, transparent 1px, transparent 40px);
}

.shelter-card {
  @apply bg-[#252525] p-5 border-l-4 border-safe transition-all hover:bg-[#333] cursor-pointer;
}

.shelter-card.danger {
  @apply border-l-danger opacity-60;
}

.protocol-card {
  @apply border-2 border-[#333] p-4 bg-surface hover:border-accent transition-colors cursor-pointer;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}
