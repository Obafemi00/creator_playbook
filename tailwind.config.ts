import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: 'var(--orange)',
        offwhite: 'var(--offwhite)',
        teal: 'var(--teal)',
        lavender: 'var(--lavender)',
        charcoal: 'var(--charcoal)',
      },
      fontFamily: {
        display: ['var(--font-baloo)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

