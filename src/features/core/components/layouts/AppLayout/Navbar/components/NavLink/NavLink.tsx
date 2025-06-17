import { Icon } from '@iconify/react';
import { Tooltip } from '@mantine/core';
import { CustomLink } from '../../../../../AppLink';
import { NavLinkProps } from './NavLink.types';
import classes from './NavLink.module.css';

export const NavLink = ({ href, label, icon, opened }: NavLinkProps) => (
  <CustomLink
    underline="never"
    className={classes.linkBase}
    to={href}
    activeProps={{
      className: classes.linkBaseActive,
    }}
  >
    <Tooltip label={label} disabled={opened} position="right" offset={20}>
      <Icon icon={icon} height={26} width={26} />
    </Tooltip>

    {opened && label}
  </CustomLink>
);
