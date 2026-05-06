export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--background)',
          fg: 'var(--foreground)',
          card: 'var(--card)',
          border: 'var(--border)',
          muted: 'var(--muted)',
          glass: 'var(--glass)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
