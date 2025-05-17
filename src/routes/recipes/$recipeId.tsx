import { createFileRoute } from '@tanstack/react-router';
import RecipeIdPage from '@/features/food/recipes/pages/$recipeId';

export const Route = createFileRoute('/recipes/$recipeId')({
  component: RecipeIdPage,
});
