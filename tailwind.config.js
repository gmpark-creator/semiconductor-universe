/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        space: {
          900: '#05060a',
          800: '#0a0d16',
          700: '#111524',
          600: '#1a2036',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(99,102,241,0.35)',
      },
    },
  },
  plugins: [],
};
