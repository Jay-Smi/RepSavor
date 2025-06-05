import '@mantine/core/styles.css';

import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from './features/core/providers/ThemeProvider';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
