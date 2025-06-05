import type { Meta, StoryObj } from '@storybook/react';
import { navLinks } from '../../MainNavbar/MainNavbar.config';
import { NavContents } from './NavContents';

const meta = {
  title: 'Components/Navbar/NavContents',
  component: NavContents,
  tags: ['autodocs'],
  argTypes: {
    opened: {
      control: 'boolean',
      description:
        'Whether the sidebar is expanded (true) or collapsed (false)',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof NavContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    opened: false,
    navLinks,
  },
};

export const Opened: Story = {
  args: {
    opened: true,
    navLinks,
  },
};
