const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        skin: {
          base: 'var(--color-bg)',
          secondary: 'var(--color-bg-secondary)',
          panel: 'var(--color-panel)',
          panelMuted: 'var(--color-panel-muted)',

          text: 'var(--color-text)',
          muted: 'var(--color-muted)',

          primary: 'var(--color-primary)',
          secondaryAccent: 'var(--color-secondary)',
          success: 'var(--color-success)',
          danger: 'var(--color-danger)',
          warning: 'var(--color-warning)',
          accent: 'var(--color-accent)',

        },
      },
      backgroundImage: {
        'skin-sidebar-gradient': 'linear-gradient(180deg, #0c0c1e 0%, #0f172a 60%, #1e3a8a 100%)',
        'skin-header': 'linear-gradient(to right, #1e3a8a, #3b82f6, #0ea5e9)',
        'skin-panel-gradient': 'linear-gradient(180deg, #0c0c1e 0%, #1e293b 100%)',
        'skin-text-gradient': 'linear-gradient(to right, #22d3ee, #3b82f6)',
      },
      fontFamily: {
        sans: ['Space Grotesk', ...fontFamily.sans],
        mono: ['Fira Code', ...fontFamily.mono],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
