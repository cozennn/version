import type { Config } from 'tailwindcss';

/**
 * Tailwind is the *bridge* between our CSS custom properties (design tokens)
 * and utility classes. Every value here reads from a CSS variable defined in
 * `src/styles/tokens.css`. Do not hardcode hex values in this file — put them
 * in tokens.css so themes and RTL can be scoped.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand — read from tokens
        brand: 'rgb(var(--brand) / <alpha-value>)',
        'brand-strong': 'rgb(var(--brand-strong) / <alpha-value>)',
        'brand-soft': 'rgb(var(--brand-soft) / <alpha-value>)',

        // Warm neutrals ("paper" base — deliberately not pure white)
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
        'ink-faint': 'rgb(var(--ink-faint) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',

        // Border scale
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',

        // Semantic
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-soft': 'rgb(var(--success-soft) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        'warning-soft': 'rgb(var(--warning-soft) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        'danger-soft': 'rgb(var(--danger-soft) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        'info-soft': 'rgb(var(--info-soft) / <alpha-value>)',

        // Rose accent (used sparingly — portfolio pull-quotes, brand details)
        rose: 'rgb(var(--rose) / <alpha-value>)',
        'rose-soft': 'rgb(var(--rose-soft) / <alpha-value>)',

        // Focus ring
        focus: 'rgb(var(--focus) / <alpha-value>)',

        // Utility
        transparent: 'transparent',
        current: 'currentColor',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        // Editorial scale. Each entry: [size, { lineHeight, letterSpacing }]
        'xs': ['0.75rem', { lineHeight: '1.15rem', letterSpacing: '0.005em' }],
        'sm': ['0.875rem', { lineHeight: '1.35rem', letterSpacing: '0.002em' }],
        'base': ['1rem', { lineHeight: '1.6rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.85rem', letterSpacing: '-0.005em' }],
        '2xl': ['1.5rem', { lineHeight: '2.05rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.4rem', letterSpacing: '-0.015em' }],
        '4xl': ['2.375rem', { lineHeight: '2.85rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '3.4rem', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '4.1rem', letterSpacing: '-0.03em' }],
      },
      spacing: {
        // 4-based scale, mirroring tokens.css
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
      borderRadius: {
        // Deliberately restrained — no pill cards, no 24px radii on containers.
        'none': '0',
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'full': '9999px',
      },
      boxShadow: {
        // Three soft tiers. No glow, no neon.
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
      },
      transitionDuration: {
        'fast': '120ms',
        'base': '240ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'norda': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      maxWidth: {
        // Container widths — wider than a SaaS blog, narrower than full-bleed.
        'prose': '68ch',
        'content': '1120px',
        'wide': '1320px',
        'bleed': '1600px',
      },
      screens: {
        'xs': '380px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--motion-base) var(--ease-out)',
        'rise-in': 'rise-in var(--motion-base) var(--ease-out)',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;