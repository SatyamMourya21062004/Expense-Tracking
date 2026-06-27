module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--primary-dark) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        neutral: 'rgb(var(--neutral) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
