import { Box, Group, Stack } from '@mantine/core';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import { PageLayoutProps } from './PageLayout.types';

const PageLayout = ({
  headerRight,
  children,
  footerLeft,
  footerRight,
}: PageLayoutProps) => (
  <Stack>
    {headerRight && (
      <Group component="header" justify="space-between">
        <AppBreadcrumbs />

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
