import { Box } from '@mantine/core';
import PageLayout from '../../PageLayout';
import { ListPageLayoutProps } from './ListPageLayout.types';

export const ListPageLayout = ({
  children,
  queryParams,
  queryParamHandlers,
  pageLayoutProps,
}: ListPageLayoutProps) => (
  <PageLayout {...pageLayoutProps} headerRight={<Box>DATA CONTROLS</Box>}>
    {children}
  </PageLayout>
);
