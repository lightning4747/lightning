/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          red: "var(--accent-red)",
          yellow: "var(--accent-yellow)",
          blue: "var(--accent-blue)",
          green: "var(--accent-green)",
          primary: "var(--accent-primary)",
          dim: "var(--accent-dim)",
        },
        glow: "var(--glow-color)",
        border: "var(--border)",
        particle: "var(--particle-color)",
      },
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        name: ["Cormorant Garamond", "serif"],
        sans: ["NTR", "DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        theme: "var(--shadow)",
      },
      animation: {
        "word-reveal": "word-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "typewriter": "typewriter 3.5s steps(40, end) infinite",
        "float": "float 10s ease-in-out infinite",
      },
      keyframes: {
        "word-reveal": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}
