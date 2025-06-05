// src/features/core/components/MainLayout/Navbar/MainNavbar.stories.tsx

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MainNavbar from './MainNavbar';

const meta = {
  title: 'Components/Navbar/MainNavbar',
  component: (args) => {
    const [opened, { toggle }] = useDisclosure(args.opened);
    return (
      <AppShell>
        <AppShell.Navbar>
          <MainNavbar opened={opened} toggle={toggle} />
        </AppShell.Navbar>
      </AppShell>
    );
  },
  tags: ['autodocs'],
  argTypes: {
    opened: {
      control: 'boolean',
      description:
        'Whether the sidebar is expanded (true) or collapsed (false)',
      defaultValue: false,
    },
    toggle: {
      action: 'toggled',
      description: 'Callback fired when the burger button is clicked',
    },
  },
} satisfies Meta<typeof MainNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    opened: false,
    toggle: action('toggle'),
  },
};

export const Opened: Story = {
  args: {
    opened: true,
    toggle: action('toggle'),
  },
};
