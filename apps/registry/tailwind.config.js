/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        accent: {
          50: 'oklch(var(--sweet-corn-50, 98.73% 0.03 102.21) / <alpha-value>)',
          100: 'oklch(var(--sweet-corn-100, 97.35% 0.07 102.42) / <alpha-value>)',
          200: 'oklch(var(--sweet-corn-200, 94.87% 0.12 101.23) / <alpha-value>)',
          300: 'oklch(var(--sweet-corn-300, 90.69% 0.17 97.42) / <alpha-value>)',
          400: 'oklch(var(--sweet-corn-400, 86.25% 0.17 91.21) / <alpha-value>)',
          500: 'oklch(var(--sweet-corn-500, 79.73% 0.16 85.26) / <alpha-value>)',
          600: 'oklch(var(--sweet-corn-600, 68.30% 0.14 75.03) / <alpha-value>)',
          700: 'oklch(var(--sweet-corn-700, 55.32% 0.12 65.26) / <alpha-value>)',
          800: 'oklch(var(--sweet-corn-800, 47.57% 0.10 60.63) / <alpha-value>)',
          900: 'oklch(var(--sweet-corn-900, 42.24% 0.09 57.49) / <alpha-value>)',
          950: 'oklch(var(--sweet-corn-950, 28.72% 0.07 53.80) / <alpha-value>)',
        },
        secondary: {
          50: 'oklch(var(--secondary-50, 97.76% 0.01 234.81) / <alpha-value>)',
          100: 'oklch(var(--secondary-100, 95.02% 0.02 239.43) / <alpha-value>)',
          200: 'oklch(var(--secondary-200, 89.64% 0.05 234.19) / <alpha-value>)',
          300: 'oklch(var(--secondary-300, 77.20% 0.11 235.35) / <alpha-value>)',
          400: 'oklch(var(--secondary-400, 72.81% 0.13 235.42) / <alpha-value>)',
          500: 'oklch(var(--secondary-500, 65.11% 0.14 239.63) / <alpha-value>)',
          600: 'oklch(var(--secondary-600, 55.78% 0.13 243.73) / <alpha-value>)',
          700: 'oklch(var(--secondary-700, 47.58% 0.11 244.93) / <alpha-value>)',
          800: 'oklch(var(--secondary-800, 42.48% 0.10 242.85) / <alpha-value>)',
          900: 'oklch(var(--secondary-900, 37.58% 0.08 243.51) / <alpha-value>)',
          950: 'oklch(var(--secondary-950, 28.37% 0.06 245.80) / <alpha-value>)',
        },
        success: {
          50: 'oklch(var(--success-50, 98.35% 0.02 159.77) / <alpha-value>)',
          100: 'oklch(var(--success-100, 96.67% 0.05 161.85) / <alpha-value>)',
          200: 'oklch(var(--success-200, 93.78% 0.09 160.35) / <alpha-value>)',
          300: 'oklch(var(--success-300, 89.67% 0.15 157.88) / <alpha-value>)',
          400: 'oklch(var(--success-400, 84.34% 0.19 154.59) / <alpha-value>)',
          500: 'oklch(var(--success-500, 77.06% 0.20 151.55) / <alpha-value>)',
          600: 'oklch(var(--success-600, 67.13% 0.18 151.08) / <alpha-value>)',
          700: 'oklch(var(--success-700, 56.17% 0.14 152.25) / <alpha-value>)',
          800: 'oklch(var(--success-800, 47.41% 0.12 153.74) / <alpha-value>)',
          900: 'oklch(var(--success-900, 41.35% 0.10 155.53) / <alpha-value>)',
          950: 'oklch(var(--success-950, 28.22% 0.07 155.64) / <alpha-value>)',
        },
        danger: {
          50: 'oklch(var(--danger-50, 97.30% 0.01 28.86) / <alpha-value>)',
          100: 'oklch(var(--danger-100, 94.00% 0.03 25.28) / <alpha-value>)',
          200: 'oklch(var(--danger-200, 89.02% 0.06 26.23) / <alpha-value>)',
          300: 'oklch(var(--danger-300, 82.01% 0.10 27.67) / <alpha-value>)',
          400: 'oklch(var(--danger-400, 70.99% 0.18 29.74) / <alpha-value>)',
          500: 'oklch(var(--danger-500, 66.35% 0.21 30.68) / <alpha-value>)',
          600: 'oklch(var(--danger-600, 60.22% 0.22 30.98) / <alpha-value>)',
          700: 'oklch(var(--danger-700, 52.78% 0.19 31.00) / <alpha-value>)',
          800: 'oklch(var(--danger-800, 46.36% 0.16 30.94) / <alpha-value>)',
          900: 'oklch(var(--danger-900, 41.19% 0.13 30.56) / <alpha-value>)',
          950: 'oklch(var(--danger-950, 26.78% 0.09 30.71) / <alpha-value>)',
        },
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
};

// my tailwind semantic colors are called accent, secondary, success, and danger. they have values 50,100,200,300,400,500,600,700,800,900,950.
