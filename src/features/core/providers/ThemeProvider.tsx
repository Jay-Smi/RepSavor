import { ReactNode } from 'react';
import { CSSVariablesResolver, MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { theme } from '@/theme';
import { APP } from '../constants';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ** global state ** //

  // ** local state ** //
  const resolver: CSSVariablesResolver = (theme) => ({
    variables: {
      '--default-spacing': theme.spacing[APP.PADDING],
      '--default-radius': theme.radius[APP.RADIUS],
      '--default-shadow': theme.shadows[APP.SHADOW],
      '--default-padding': theme.spacing[APP.PADDING],
    },
    light: {
      '--mantine-color-body': theme.colors.gray[2],
      '--mantine-color-default-hover': theme.colors.gray[1],
    },
    dark: {},
  });

  // ** local vars ** //

  // ** handlers ** //
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      stylesTransform={emotionTransform}
      cssVariablesResolver={resolver}
    >
      <MantineEmotionProvider>{children}</MantineEmotionProvider>
    </MantineProvider>
  );
};
