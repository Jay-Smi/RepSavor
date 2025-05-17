import { FoodItemBase } from '../FoodItemBase';
import { Macros } from '../Macros';
import { Portion } from '../Portion';

export interface CustomFood extends FoodItemBase, Portion {
  type: 'custom';
  defaultPortion: Portion; // suggested default
  cachedMacros?: Macros; // user-provided or auto-calculated
}
