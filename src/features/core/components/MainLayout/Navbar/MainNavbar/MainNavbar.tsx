import clsx from 'clsx';
import { AppShell, Box, Card, Divider, ScrollArea, Stack } from '@mantine/core';
import { ColorSchemeToggle } from '@/features/core/components/ColorSchemeToggle/ColorSchemeToggle';
import { SpotlightSearchBar } from '../../../spotlight/SpotlightSearchBar';
import { NavContents } from '../components/NavContents/NavContents';
import { NavHeader } from '../components/NavHeader/NavHeader';
import { navLinks } from './MainNavbar.config';
import { MainNavbarProps } from './MainNavbar.types';
import classes from './MainNavbar.module.css';

const MainNavbar = ({ opened, toggle }: MainNavbarProps) => (
  <Box className={classes.container}>
    <Card component={Stack} className={classes.card}>
      <AppShell.Section className={classes.section}>
        <NavHeader opened={opened} onToggle={toggle} />
      </AppShell.Section>

      <AppShell.Section className={classes.section}>
        <SpotlightSearchBar opened={opened} />
      </AppShell.Section>

      <AppShell.Section grow component={ScrollArea}>
        <NavContents opened={opened} navLinks={navLinks} />
      </AppShell.Section>

      <Divider className={classes.divider} />

      <AppShell.Section className={clsx(classes.section, classes.lastSection)}>
        <ColorSchemeToggle opened={opened} />
      </AppShell.Section>
    </Card>
  </Box>
);
export default MainNavbar;
