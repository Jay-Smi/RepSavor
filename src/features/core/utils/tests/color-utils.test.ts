import { describe, expect, it } from 'vitest';
import { stringToHSL } from '../color-utils';

describe('stringToHSL', () => {
  it('should return hsl(0, 100%, 75%) for empty string', () => {
    expect(stringToHSL('')).toBe('hsl(0, 100%, 75%)');
  });

  it('should return consistent hsl value for a given input', () => {
    const result1 = stringToHSL('test');
    const result2 = stringToHSL('test');
    // Based on the calculation for "test":
    // 't' = 116, 'e' = 101, 's' = 115, 't' = 116 => final hash % 360 = 58
    expect(result1).toBe('hsl(58, 100%, 75%)');
    expect(result2).toBe(result1);
  });

  it('should respect custom saturation and lightness', () => {
    const result = stringToHSL('test', 50, 50);
    // With the same hash value as above, but custom saturation and lightness.
    expect(result).toBe('hsl(58, 50%, 50%)');
  });

  it('should produce different hsl values for different strings', () => {
    const hslHello = stringToHSL('hello');
    const hslWorld = stringToHSL('world');
    expect(hslHello).not.toBe(hslWorld);
  });
});
