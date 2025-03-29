/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'tg-bg': 'var(--tg-bg-color)',
                'tg-text': 'var(--tg-text-color)',
                'tg-button': 'var(--tg-button-color)',
                'tg-button-text': 'var(--tg-button-text-color)',
                'bg': 'var(--bg-color)',
                'paper': 'var(--paper-color)',
                'text': 'var(--text-color)',
                'text-secondary': 'var(--text-secondary-color)',
                'accent': 'var(--accent-color)',
                'accent-light': 'var(--accent-light-color)',
                'accent-dark': 'var(--accent-dark-color)',
                'border': 'var(--border-color)',
                'shadow': 'var(--shadow-color)',
                'error-color': 'var(--error-color)',
                'error-light': 'var(--error-light-color)',
                'success-color': 'var(--success-color)',
                'success-light': 'var(--success-light-color)',
                'warning-color': 'var(--warning-color)',
                'warning-light': 'var(--warning-light-color)',
                'info-color': 'var(--info-color)',
                'info-light': 'var(--info-light-color)',
                'background': 'var(--bg-color)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fadeIn': 'fadeIn 0.15s ease-in-out',
                'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin': 'spin 1s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' },
                },
                spin: {
                    'to': { transform: 'rotate(360deg)' },
                },
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'none': 'none',
            },
            borderRadius: {
                'sm': '0.125rem',
                'DEFAULT': '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                'full': '9999px',
            },
        },
    },
    plugins: [],
} 