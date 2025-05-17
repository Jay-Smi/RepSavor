import { ReactNode } from 'react';
import { AppShell, Burger, Group, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MainNavbar from './MainNavbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // ** global state ** //

  // ** local state ** //
  const [navbarOpen, { toggle: toggleNavbar }] = useDisclosure(false);
  // ** local vars ** //

  // ** handlers ** //
  return (
    <AppShell
      header={{
        height: 60,
      }}
      navbar={{
        width: navbarOpen ? 250 : 60,
        breakpoint: 'sm',
        collapsed: { mobile: !navbarOpen, desktop: false },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Image src="/logo.png" h={60} w={60} />
          <Burger opened={navbarOpen} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>

      <MainNavbar opened={navbarOpen} toggle={toggleNavbar} />

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
export default MainLayout;
