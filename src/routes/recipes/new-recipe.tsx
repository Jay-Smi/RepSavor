import { createFileRoute } from '@tanstack/react-router';
import NewRecipePage from '@/features/food/recipes/pages/NewRecipePage';

export const Route = createFileRoute('/recipes/new-recipe')({
  component: NewRecipePage,
});
