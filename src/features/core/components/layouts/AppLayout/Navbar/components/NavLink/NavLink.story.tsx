import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from './NavLink';

const meta = {
  title: 'Components/Navbar/NavLink',
  component: NavLink,
  // tags: ['autodocs'],
  // argTypes: {
  //   href: {
  //     control: 'text',
  //     description: 'Destination URL',
  //   },
  //   label: {
  //     control: 'text',
  //     description: 'Text label for tooltip and expanded state',
  //   },
  //   icon: {
  //     control: 'text',
  //     description: 'Iconify icon string (e.g. "mdi:home")',
  //   },
  //   opened: {
  //     control: 'boolean',
  //     description:
  //       'Whether the nav is expanded (shows label) or collapsed (icon-only)',
  //   },
  // },
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'mdi:home',
    opened: false,
  },
};

export const Opened: Story = {
  args: {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'mdi:home',
    opened: true,
  },
};
export const Active: Story = {
  args: {
    href: '/',
    label: 'Home',
    icon: 'mdi:home',
    opened: true,
  },
};
