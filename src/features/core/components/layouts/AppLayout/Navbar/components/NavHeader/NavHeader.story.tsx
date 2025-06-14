// src/components/NavHeader/NavHeader.stories.tsx

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { NavHeader } from './NavHeader';

const meta = {
  title: 'Components/Navbar/NavHeader',
  component: NavHeader,
  tags: ['autodocs'],
  argTypes: {
    opened: {
      control: 'boolean',
      description:
        'Whether the side nav is expanded (true) or collapsed (false)',
      defaultValue: false,
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback fired when the burger button is clicked',
    },
  },
} satisfies Meta<typeof NavHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    opened: false,
    onToggle: action('nav-toggled'),
  },
};

export const Opened: Story = {
  args: {
    opened: true,
    onToggle: action('nav-toggled'),
  },
};
