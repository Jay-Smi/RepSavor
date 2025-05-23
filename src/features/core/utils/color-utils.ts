/**
 * Converts a string into a deterministic HSL color representation
 * by generating a hash from the input.
 */
export function stringToHSL(str: string, saturation = 100, lightness = 75) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash &= hash; // Keep only the first 32 bits
  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
}
