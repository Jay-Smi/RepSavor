import { createFileRoute } from '@tanstack/react-router';
import RecipesPage from '@/features/food/recipes/pages';

export const Route = createFileRoute('/recipes/')({
  component: RecipesPage,
});
