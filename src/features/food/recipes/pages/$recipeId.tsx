import { useParams } from '@tanstack/react-router';

interface RecipeIdPageProps {}

const RecipeIdPage = ({}: RecipeIdPageProps) => {
  // ** global state ** //
  const { recipeId } = useParams({
    from: '/recipes/$recipeId',
  });

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <div>
      RecipeIdPage
      <div>recipeId: {recipeId}</div>
    </div>
  );
};
export default RecipeIdPage;
