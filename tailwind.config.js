/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#1DDF81',
          secondary: '#02624C',
          accent: '#158563',
          neutral: '#F4F4F4',
          'base-100': '#E5F7F2',
          'base-200': '#B3F5D9',
          'base-300': '#030F0E',
          info: '#00a5ff',
          success: '#a6f235',
          warning: '#d14200',
          error: '#EB4235',
        },
      },
      'dark',
      'cupcake',
    ],
  },
  plugins: [require('daisyui')],
}

