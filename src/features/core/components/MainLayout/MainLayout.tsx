import { ReactNode } from 'react';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { APP, CV } from '../../constants';
import { useIsMobile } from '../../hooks/useIsMobile';
import { AppIcon } from '../AppIcon';
import MainNavbar from './Navbar/MainNavbar/MainNavbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // ** global state ** //

  // ** local state ** //
  const isMobile = useIsMobile();
  const [navbarOpen, { toggle: toggleNavbar }] = useDisclosure(!isMobile);
  // ** local vars ** //

  // ** handlers ** //
  return (
    <AppShell
      layout="alt"
      padding={APP.PADDING}
      header={{
        height: APP.HEADER_HEIGHT,
        collapsed: !isMobile,
      }}
      navbar={{
        width: navbarOpen ? 250 : 85,
        breakpoint: APP.MOBILE_BREAKPOINT,
        collapsed: { mobile: !navbarOpen, desktop: false },
      }}
      styles={{
        root: {
          padding: APP.PADDING,
        },
      }}
    >
      <AppShell.Header hiddenFrom={APP.MOBILE_BREAKPOINT}>
        <Group h="100%" px="md" justify="space-between" align="center">
          <AppIcon />
          <Burger opened={navbarOpen} onClick={toggleNavbar} size="sm" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <MainNavbar opened={navbarOpen} toggle={toggleNavbar} />
      </AppShell.Navbar>

      <AppShell.Main h={CV.mainContentHeight}>{children}</AppShell.Main>
    </AppShell>
  );
};
export default MainLayout;
