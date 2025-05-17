import { Outlet } from '@tanstack/react-router';

interface RecipesLayoutProps {}

const RecipesLayout = ({}: RecipesLayoutProps) => {
  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <div>
      RecipesLayout
      <Outlet />
    </div>
  );
};
export default RecipesLayout;
