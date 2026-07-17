import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest:  { 900: '#060B08', 800: '#0A140C', 700: '#0D1F0F' },
        gold:    { DEFAULT: '#C9A227', light: '#FFD700' },
        muted:   '#3D5A3F',
        parchment: '#F0E6D3',
      },
    },
  },
  plugins: [],
};

export default config;