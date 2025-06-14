import { createFileRoute } from '@tanstack/react-router';
import NewRecipePage from '@/features/food/recipes/pages/new';

export const Route = createFileRoute('/recipes/new')({
  component: NewRecipePage,
});
