import { AppDB } from './db';

// ======= Populate Functions =======
export async function populateIngredients(db: AppDB) {
  await db.ingredients.bulkAdd([
    {
      name: 'Chicken Breast',
      type: 'ingredient',
      tags: ['protein'],
      externalLink: '',
    },
    { name: 'Broccoli', type: 'ingredient', tags: ['vegetable'] },
  ]);
}

export async function populateRecipes(db: AppDB) {
  await db.recipes.bulkAdd([
    {
      name: 'Grilled Chicken Salad',
      type: 'recipe',
      instructions: 'Season and grill chicken, chop veggies, toss all.',
      servings: 2,
      tags: ['salad', 'high-protein'],
      externalLink: '',
    },
    {
      name: 'Vegetable Stir Fry',
      type: 'recipe',
      instructions: 'Stir fry veggies in a wok with soy sauce.',
      servings: 4,
      tags: ['stir-fry', 'vegetarian'],
      externalLink: '',
    },
    {
      name: 'Protein Smoothie',
      type: 'recipe',
      instructions: 'Blend protein powder with milk and fruits.',
      servings: 1,
      tags: ['smoothie', 'high-protein'],
      externalLink: '',
    },
    {
      name: 'Oatmeal with Fruits',
      type: 'recipe',
      instructions: 'Cook oats and top with fruits and nuts.',
      servings: 1,
      tags: ['breakfast', 'healthy'],
      externalLink: '',
    },
    {
      name: 'Pasta Primavera',
      type: 'recipe',
      instructions: 'Cook pasta and toss with sautéed vegetables.',
      servings: 2,
      tags: ['pasta', 'vegetarian'],
      externalLink: '',
    },
    {
      name: 'Chicken Tacos',
      type: 'recipe',
      instructions: 'Fill tortillas with grilled chicken and toppings.',
      servings: 3,
      tags: ['taco', 'high-protein'],
      externalLink: '',
    },
    {
      name: 'Quinoa Salad',
      type: 'recipe',
      instructions: 'Mix cooked quinoa with veggies and dressing.',
      servings: 4,
      tags: ['salad', 'healthy'],
      externalLink: '',
    },
    {
      name: 'Fruit Salad',
      type: 'recipe',
      instructions: 'Chop and mix various fruits.',
      servings: 2,
      tags: ['salad', 'healthy'],
      externalLink: '',
    },
    {
      name: 'Egg Omelette',
      type: 'recipe',
      instructions: 'Beat eggs and cook in a pan.',
      servings: 1,
      tags: ['breakfast', 'high-protein'],
      externalLink: '',
    },
    {
      name: 'Chocolate Chip Cookies',
      type: 'recipe',
      instructions: 'Mix ingredients and bake.',
      servings: 12,
      tags: ['dessert', 'sweet'],
      externalLink: '',
    },
    {
      name: 'Caesar Salad',
      type: 'recipe',
      instructions: 'Toss romaine with dressing, croutons, and cheese.',
      servings: 2,
      tags: ['salad', 'healthy'],
      externalLink: '',
    },
  ]);
}

export async function populateCustomFoods(db: AppDB) {
  await db.customFoods.bulkAdd([
    {
      name: 'Protein Bar',
      type: 'custom',
      quantity: 1,
      unit: 'bar',
      tags: ['snack', 'high-protein'],
      defaultPortion: { quantity: 1, unit: 'bar' },
      cachedMacros: { protein: 10, fat: 8, carbs: 20 },
    },
  ]);
}

export async function populateRecipeIngredients(db: AppDB) {
  const salad = await db.recipes
    .where('name')
    .equals('Grilled Chicken Salad')
    .first();
  const chicken = await db.ingredients
    .where('name')
    .equals('Chicken Breast')
    .first();
  const broccoli = await db.ingredients
    .where('name')
    .equals('Broccoli')
    .first();
  if (salad?.id && chicken?.id && broccoli?.id) {
    await db.recipeIngredients.bulkAdd([
      {
        recipeId: salad.id,
        ingredientId: chicken.id,
        quantity: 300,
        unit: 'g',
        gramsEquivalent: 300,
      },
      {
        recipeId: salad.id,
        ingredientId: broccoli.id,
        quantity: 150,
        unit: 'g',
        gramsEquivalent: 150,
      },
    ]);
  }
}

export async function populateNutrients(db: AppDB) {
  await db.nutrients.bulkAdd([
    { name: 'Protein', unit: 'g' },
    { name: 'Fat', unit: 'g' },
    { name: 'Carbs', unit: 'g' },
  ]);
}

export async function populateNutritionFacts(db: AppDB) {
  const protein = await db.nutrients.where('name').equals('Protein').first();
  const fat = await db.nutrients.where('name').equals('Fat').first();
  const carbs = await db.nutrients.where('name').equals('Carbs').first();
  const chicken = await db.ingredients
    .where('name')
    .equals('Chicken Breast')
    .first();
  const broccoli = await db.ingredients
    .where('name')
    .equals('Broccoli')
    .first();
  if (protein && fat && carbs) {
    if (chicken?.id) {
      await db.nutritionFacts.bulkAdd([
        {
          itemType: 'ingredient',
          itemId: chicken.id,
          nutrientId: protein.id!,
          amountPerUnit: 31,
        },
        {
          itemType: 'ingredient',
          itemId: chicken.id,
          nutrientId: fat.id!,
          amountPerUnit: 3.6,
        },
        {
          itemType: 'ingredient',
          itemId: chicken.id,
          nutrientId: carbs.id!,
          amountPerUnit: 0,
        },
      ]);
    }
    if (broccoli?.id) {
      await db.nutritionFacts.bulkAdd([
        {
          itemType: 'ingredient',
          itemId: broccoli.id,
          nutrientId: protein.id!,
          amountPerUnit: 2.8,
        },
        {
          itemType: 'ingredient',
          itemId: broccoli.id,
          nutrientId: fat.id!,
          amountPerUnit: 0.4,
        },
        {
          itemType: 'ingredient',
          itemId: broccoli.id,
          nutrientId: carbs.id!,
          amountPerUnit: 7,
        },
      ]);
    }
  }
}

export async function populateReviews(db: AppDB) {
  const salad = await db.recipes
    .where('name')
    .equals('Grilled Chicken Salad')
    .first();
  if (salad?.id) {
    await db.reviews.add({
      itemType: 'recipe',
      itemId: salad.id,
      rating: 5,
      comment: 'Delicious!',
      createdAt: Date.now(),
    });
  }
}

export async function populateConsumptions(db: AppDB) {
  const salad = await db.recipes
    .where('name')
    .equals('Grilled Chicken Salad')
    .first();
  if (salad?.id) {
    await db.consumptions.bulkAdd([
      {
        itemType: 'recipe',
        itemId: salad.id,
        quantity: 1,
        unit: 'serving',
        date: Date.now() - 86400000,
      }, // yesterday
      {
        itemType: 'recipe',
        itemId: salad.id,
        quantity: 2,
        unit: 'serving',
        date: Date.now(),
      },
    ]);
  }
}

export async function populateShoppingLists(db: AppDB) {
  const listId = await db.shoppingLists.add({ name: 'Weekly Groceries' });
  return listId;
}

export async function populateShoppingListItems(db: AppDB) {
  const list = await db.shoppingLists
    .where('name')
    .equals('Weekly Groceries')
    .first();
  const chicken = await db.ingredients
    .where('name')
    .equals('Chicken Breast')
    .first();
  if (list?.id) {
    await db.shoppingListItems.bulkAdd([
      {
        listId: list.id,
        itemType: 'ingredient',
        itemId: chicken?.id,
        name: 'Chicken Breast',
        purchased: false,
        quantity: 2,
        unit: 'lb',
      },
      {
        listId: list.id,
        name: 'Milk',
        purchased: false,
        quantity: 1,
        unit: 'gal',
      },
    ]);
  }
}
