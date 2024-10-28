import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      wink: {
        50: '#e3ecff',
        100: '#c8d9ff',
        200: '#a6c1ff',
        300: '#83a9ff',
        400: '#5f8fff',
        500: '#3a70ff', // Base color
        600: '#2f5ce6',
        700: '#2649b3',
        800: '#1d3680',
        900: '#14234d',
      },
    },
  },
};

export default config;
