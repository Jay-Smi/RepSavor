export const APP = {
  NAME: 'RepSavor',
  HEADER_HEIGHT: 60,
  MOBILE_BREAKPOINT: 'sm',
  RADIUS: 'md',
  SHADOW: 'md',
  PADDING: 'sm',
};

// ** CSS VARIABLES ** //
export const CV = {
  spacing: `var(--mantine-spacing-${APP.PADDING})`,
  borderRadius: `var(--mantine-radius-${APP.RADIUS})`,
  padding: `var(--mantine-spacing-${APP.PADDING})`,
  text: 'var(--mantine-color-text)',
  border: 'var(--mantine-color-default-border)',
  hover: 'var(--mantine-color-default-hover)',
  dimmed: 'var(--mantine-color-dimmed)',
  primaryFilled: 'var(--mantine-primary-color-filled)',
  primaryHover: 'var(--mantine-primary-color-filled-hover)',
  mainContentHeight:
    'calc(100svh - var(--app-shell-header-offset, 0rem) - var(--app-shell-footer-offset, 0rem))',
};

// ** ICONS ** //
