import { createFileRoute } from '@tanstack/react-router';
import RecipeIdEditPage from '@/features/food/recipes/pages/$recipeId.edit';

export const Route = createFileRoute('/recipes/$recipeId/edit')({
  component: RecipeIdEditPage,
});
