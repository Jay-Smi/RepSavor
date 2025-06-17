import { createFileRoute } from '@tanstack/react-router';
import RecipesPage from '@/features/food/recipes/pages/RecipesPage';

export const Route = createFileRoute('/recipes/')({
  component: RecipesPage,
});
