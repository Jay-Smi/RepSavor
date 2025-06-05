import { NavLink } from '../../../../types/nav.types';

export const navLinks: NavLink[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: 'tabler:layout-dashboard',
  },
  {
    href: '/recipes',
    label: 'Recipes',
    icon: 'tabler:book',
  },
  {
    href: '/ingredients',
    label: 'Ingredients',
    icon: 'mdi:chicken-leg-outline',
  },
  {
    href: '/food-log',
    label: 'Food Log',
    icon: 'tabler:calendar-month',
  },
  {
    href: '/shopping-list',
    label: 'Shopping List',
    icon: 'tabler:shopping-cart',
  },
  {
    href: '/consumption',
    label: 'Analytics',
    icon: 'tabler:chart-pie',
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: 'tabler:settings',
  },
] as const;
