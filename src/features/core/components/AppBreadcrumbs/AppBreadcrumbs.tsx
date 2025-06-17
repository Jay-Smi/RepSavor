import { Breadcrumbs, Title } from '@mantine/core';
import { CustomLink } from '../AppLink';
import { useBreadcrumbs } from './hooks/useAppBreadcrumbs';

const AppBreadcrumbs = () => {
  // ** global state ** //
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumbs>
      {breadcrumbs.map(({ label, to }, i) =>
        i === breadcrumbs.length - 1 ? (
          <Title key={to} fz="h2">
            {label}
          </Title>
        ) : (
          <CustomLink key={to} to={to}>
            {label}
          </CustomLink>
        )
      )}
    </Breadcrumbs>
  );
};

export default AppBreadcrumbs;
