import { AppShell, Burger, Card, createTheme } from '@mantine/core';
import { APP, CV } from './features/core/constants';

export const theme = createTheme({
  cursorType: 'pointer',
  components: {
    AppShell: AppShell.extend({
      defaultProps: {
        withBorder: false,
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: APP.RADIUS,
        shadow: APP.SHADOW,
      },
    }),
    Burger: Burger.extend({
      defaultProps: {
        sx: {
          borderRadius: CV.borderRadius,
          '&:hover': {
            backgroundColor: CV.hover,
          },
        },
      },
    }),
  },
});
