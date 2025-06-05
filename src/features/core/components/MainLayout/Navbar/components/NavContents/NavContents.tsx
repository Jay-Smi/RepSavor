import { Space, Stack, Text } from '@mantine/core';
import { NavLink } from '../NavLink/NavLink';
import { NavContentsProps } from './NavContents.types';
import classes from './NavContents.module.css';

export const NavContents = ({ opened, navLinks }: NavContentsProps) => (
  <Stack className={classes.container}>
    {opened ? (
      <Text c="dimmed" className={classes.text}>
        Navigation
      </Text>
    ) : (
      <Space h={24.8} />
    )}

    {navLinks.map((props, i) => (
      <NavLink key={i} opened={opened} {...props} />
    ))}
  </Stack>
);
