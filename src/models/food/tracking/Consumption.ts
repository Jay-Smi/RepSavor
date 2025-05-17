import { FoodItemBase } from '../FoodItemBase';
import { Portion } from '../Portion';

/** Logs actual consumption events */
export interface Consumption extends Portion {
  id?: number;
  itemType: FoodItemBase['type'];
  itemId: number;
  date: number; // UTC timestamp for consumption date/time
  time?: string; // optional HH:mm string
}
