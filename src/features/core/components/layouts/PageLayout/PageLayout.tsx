import { Box, Group, Stack } from '@mantine/core';
import { PageLayoutProps } from './PageLayout.types';

const PageLayout = ({
  headerLeft,
  headerRight,
  children,
  footerLeft,
  footerRight,
}: PageLayoutProps) => (
  <Stack>
    {(headerLeft || headerRight) && (
      <Group component="header" justify="space-between">
        {headerLeft || <Box />}
        {headerRight}
      </Group>
    )}

    <Box component="main">{children}</Box>

    {(footerLeft || footerRight) && (
      <Group component="footer" justify="space-between">
        {footerLeft || <Box />}
        {footerRight}
      </Group>
    )}
  </Stack>
);
export default PageLayout;
