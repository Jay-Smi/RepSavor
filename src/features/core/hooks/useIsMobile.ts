import { useMatches } from '@mantine/core';

export const useIsMobile = (): boolean =>
  useMatches(
    {
      base: true,
      sm: false,
    },
    {
      getInitialValueInEffect: false,
    }
  );
