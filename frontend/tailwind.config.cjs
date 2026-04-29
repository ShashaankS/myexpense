/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f9fafb',
        surface: '#ffffff',
        border: '#e5e7eb',
        primary: '#111827',
        secondary: '#6b7280',
        accent: '#2563eb',
        accentDark: '#1d4ed8',
      },
      boxShadow: {
        soft: '0 10px 20px -15px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
}
