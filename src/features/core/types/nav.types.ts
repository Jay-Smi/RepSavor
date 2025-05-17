import { router } from '@/router';

// ** NAV TYPES ** //
export type RoutePath = (typeof router.flatRoutes)[number]['fullPath'];

export type NavLink = {
  href: RoutePath;
  label: string;
  icon: string;
  target?: string;
};
