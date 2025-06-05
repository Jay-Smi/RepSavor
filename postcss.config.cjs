module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',

        'default-spacing': 'var(--mantine-spacing-sm)',
        'default-radius': 'var(--mantine-radius-md)',
        'default-shadow': 'var(--mantine-shadow-md)',
        'default-header-height': '60px',
      },
    },
  },
};
