import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e8f7ef',
          100: '#d2f0df',
          200: '#a7e1be',
          300: '#7cd29e',
          400: '#51c37d',
          500: '#2a9d5b',
          600: '#227f49',
          700: '#1a6137',
          800: '#124224',
          900: '#092112'
        }
      }
    },
  },
  plugins: [],
};

export default config;
