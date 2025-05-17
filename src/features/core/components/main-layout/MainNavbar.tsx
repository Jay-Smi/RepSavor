import { Icon } from '@iconify/react';
import { AppShell, Burger, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { CustomLink } from '../CustomLink';
import { navLinks } from './config';

interface MainNavbarProps {
  opened: boolean;
  toggle: () => void;
}

const MainNavbar = ({ opened, toggle }: MainNavbarProps) => {
  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <AppShell.Navbar>
      <AppShell.Section>
        <Group justify="space-between" px="md" py="xs">
          <Burger opened={opened} onClick={toggle} visibleFrom="sm" size="sm" />
        </Group>
      </AppShell.Section>

      <AppShell.Section grow component={ScrollArea}>
        <Stack px="sm">
          {navLinks.map(({ href, label, icon }, i) => (
            <Group key={i} wrap="nowrap">
              <CustomLink
                to={href}
                style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <Icon icon={icon} />
                {opened && <Text span>{label}</Text>}
              </CustomLink>
            </Group>
          ))}
        </Stack>
      </AppShell.Section>

      <AppShell.Section>Footer</AppShell.Section>
    </AppShell.Navbar>
  );
};
export default MainNavbar;
