import '@mantine/core/styles.css';

import { RouterProvider } from '@tanstack/react-router';
import { MantineProvider } from '@mantine/core';
import { router } from './router';
import { theme } from './theme';

// PLAN
// tesseract.js to parse nutrition labels

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
