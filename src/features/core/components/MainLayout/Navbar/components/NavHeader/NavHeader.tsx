import { Burger, Group } from '@mantine/core';
import { AppLogo } from '../../../../AppLogo';
import { NavHeaderProps } from './NavHeader.types';
import classes from './NavHeader.module.css';

export const NavHeader = ({ opened, onToggle }: NavHeaderProps) => (
  <Group className={classes.container} data-opened={opened}>
    {opened && <AppLogo />}

    <Burger
      opened={opened}
      onClick={onToggle}
      size="sm"
      aria-label="Toggle navigation"
    />
  </Group>
);
