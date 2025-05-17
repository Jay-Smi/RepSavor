import { createFileRoute } from '@tanstack/react-router';
import RecipesLayout from '@/features/food/recipes/pages/__layout';

export const Route = createFileRoute('/recipes/__layout')({
  component: RecipesLayout,
});
