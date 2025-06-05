import '@mantine/core/styles.css';

import React, { useEffect } from 'react';
import { addons } from '@storybook/preview-api';
import type { PartialStoryFn, StoryContext } from '@storybook/types';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { useMantineColorScheme } from '@mantine/core';
import { ThemeProvider } from '../src/features/core/providers/ThemeProvider';

export default function withRouter(
  Story: PartialStoryFn,
  { parameters }: StoryContext
) {
  const {
    initialEntries = ['/'],
    initialIndex,
    routes = ['*'],
  } = parameters?.router || {};

  const rootRoute = createRootRoute();

  const children = routes.map((path) =>
    createRoute({
      path,
      getParentRoute: () => rootRoute,
      component: Story,
    })
  );

  rootRoute.addChildren(children);

  const router = createRouter({
    history: createMemoryHistory({ initialEntries, initialIndex }),
    routeTree: rootRoute,
  });

  return <RouterProvider router={router} />;
}

declare module '@storybook/types' {
  interface Parameters {
    router?: {
      initialEntries?: string[];
      initialIndex?: number;
      routes?: string[];
    };
  }
}

const channel = addons.getChannel();

export const parameters = {
  layout: 'fullscreen',
  options: {
    showPanel: false,
  },
};

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) =>
    setColorScheme(value ? 'dark' : 'light');

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return children;
}

export const decorators = [
  (renderStory: any) => (
    <ColorSchemeWrapper>{renderStory()}</ColorSchemeWrapper>
  ),
  (renderStory: any) => <ThemeProvider>{renderStory()}</ThemeProvider>,
  withRouter,
];
