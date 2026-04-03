/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'surface-container-low': '#f7f7f7',
        'surface-container': '#eeeeee',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e1e3e3',
        'surface-container-highest': '#e5e7eb',
        surface: '#F9FAFB',
        'on-surface': '#1A1C1C',
        background: '#F9FAFB',
        primary: '#EAB308',
        'primary-container': '#FEF9C3',
        secondary: '#605e00',
        tertiary: '#4e6300',
        outline: '#8e9191',
        'outline-variant': '#d1d5db',
        'error-container': '#FEE2E2',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
