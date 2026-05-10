/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#C4703A',
          light: '#f0d5c0',
          dark: '#9e5a2f',
        },
        teal: {
          DEFAULT: '#1B4D5C',
          light: '#d0e8ee',
          dark: '#122f38',
        },
        gold: {
          DEFAULT: '#E8C97E',
          light: '#faf3e0',
          dark: '#c4a030',
        },
        warm: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          border: '#EDE8E0',
        },
        ink: {
          DEFAULT: '#1C1C1C',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(28,28,28,0.07)',
        'card-hover': '0 8px 30px rgba(28,28,28,0.12)',
        float: '0 20px 60px rgba(28,28,28,0.15)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
