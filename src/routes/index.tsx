import { createFileRoute } from '@tanstack/react-router';
import LoadingPage from '@/features/core/pages/LoadingPage';

export const Route = createFileRoute('/')({
  component: () => <LoadingPage />,
});
