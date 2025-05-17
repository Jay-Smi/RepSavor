/** Simple portion descriptor for recipes and consumption */
export interface Portion {
  quantity: number; // numeric (1, 0.5, etc.)
  unit: string; // e.g., 'g', 'cup', 'serving'
  fraction?: string; // original fraction (e.g., '1/2')
  gramsEquivalent?: number; // normalized grams for macro calculations
}
