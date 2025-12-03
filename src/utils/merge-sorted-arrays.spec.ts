import { merge } from './merge-sorted-arrays';

describe('merge', () => {
  describe('Basic functionality', () => {
    it('should merge three sorted arrays correctly', () => {
      const collection_1 = [5, 3, 1]; // max to min
      const collection_2 = [2, 4, 6]; // min to max
      const collection_3 = [1, 3, 7]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 1, 2, 3, 3, 4, 5, 6, 7]);
    });

    it('should handle arrays with single elements', () => {
      const collection_1 = [5];
      const collection_2 = [3];
      const collection_3 = [7];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([3, 5, 7]);
    });

    it('should merge arrays with duplicate values across collections', () => {
      const collection_1 = [10, 5, 5, 1]; // max to min
      const collection_2 = [1, 5, 10]; // min to max
      const collection_3 = [5, 10]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 1, 5, 5, 5, 5, 10, 10, 10]);
    });
  });

  describe('Edge cases with empty arrays', () => {
    it('should handle when collection_1 is empty', () => {
      const collection_1: number[] = [];
      const collection_2 = [1, 3, 5];
      const collection_3 = [2, 4, 6];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle when collection_2 is empty', () => {
      const collection_1 = [6, 4, 2];
      const collection_2: number[] = [];
      const collection_3 = [1, 3, 5];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle when collection_3 is empty', () => {
      const collection_1 = [6, 4, 2];
      const collection_2 = [1, 3, 5];
      const collection_3: number[] = [];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle when two collections are empty', () => {
      const collection_1: number[] = [];
      const collection_2: number[] = [];
      const collection_3 = [1, 3, 5, 7];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 3, 5, 7]);
    });

    it('should handle when all collections are empty', () => {
      const collection_1: number[] = [];
      const collection_2: number[] = [];
      const collection_3: number[] = [];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([]);
    });
  });

  describe('Arrays of different lengths', () => {
    it('should merge when collection_1 is much longer', () => {
      const collection_1 = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]; // max to min
      const collection_2 = [15, 25]; // min to max
      const collection_3 = [5]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([
        5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100,
      ]);
    });

    it('should merge when collection_2 is much longer', () => {
      const collection_1 = [30, 20]; // max to min
      const collection_2 = [1, 5, 10, 15, 25, 35, 40, 45, 50]; // min to max
      const collection_3 = [22]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 5, 10, 15, 20, 22, 25, 30, 35, 40, 45, 50]);
    });

    it('should merge when collection_3 is much longer', () => {
      const collection_1 = [15]; // max to min
      const collection_2 = [5, 25]; // min to max
      const collection_3 = [1, 2, 3, 10, 20, 30, 40, 50]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50]);
    });
  });

  describe('Special numeric cases', () => {
    it('should handle negative numbers', () => {
      const collection_1 = [10, 0, -5, -10]; // max to min
      const collection_2 = [-8, -3, 2, 7]; // min to max
      const collection_3 = [-6, 4, 9]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([-10, -8, -6, -5, -3, 0, 2, 4, 7, 9, 10]);
    });

    it('should handle all negative numbers', () => {
      const collection_1 = [-1, -5, -10]; // max to min
      const collection_2 = [-9, -6, -2]; // min to max
      const collection_3 = [-8, -4, -3]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([-10, -9, -8, -6, -5, -4, -3, -2, -1]);
    });

    it('should handle zeros', () => {
      const collection_1 = [5, 0, 0, -5]; // max to min
      const collection_2 = [0, 0, 3]; // min to max
      const collection_3 = [-3, 0, 2]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([-5, -3, 0, 0, 0, 0, 0, 2, 3, 5]);
    });

    it('should handle large numbers', () => {
      const collection_1 = [1000000, 500000, 100000]; // max to min
      const collection_2 = [200000, 600000, 2000000]; // min to max
      const collection_3 = [300000, 700000]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([
        100000, 200000, 300000, 500000, 600000, 700000, 1000000, 2000000,
      ]);
    });
  });

  describe('Arrays with same elements', () => {
    it('should handle when all arrays have the same single value', () => {
      const collection_1 = [5, 5, 5];
      const collection_2 = [5, 5];
      const collection_3 = [5, 5, 5, 5];

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([5, 5, 5, 5, 5, 5, 5, 5, 5]);
    });

    it('should handle arrays where all elements are identical within each array', () => {
      const collection_1 = [3, 3, 3]; // max to min (all same)
      const collection_2 = [2, 2, 2]; // min to max (all same)
      const collection_3 = [1, 1, 1]; // min to max (all same)

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
    });
  });

  describe('Verify result is sorted', () => {
    it('should return result in ascending order with random input', () => {
      const collection_1 = [99, 87, 65, 43, 21]; // max to min
      const collection_2 = [10, 22, 34, 46, 58, 70]; // min to max
      const collection_3 = [15, 35, 55, 75, 95]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      // Verify the result is sorted
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
      }

      // Verify all elements are present
      expect(result.length).toBe(16);
    });
  });

  describe('Boundary overlaps', () => {
    it('should handle when collection_1 min overlaps with collection_2 max', () => {
      const collection_1 = [50, 30, 10]; // max to min
      const collection_2 = [10, 30, 50]; // min to max
      const collection_3 = [20, 40]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([10, 10, 20, 30, 30, 40, 50, 50]);
    });

    it('should handle when all arrays share boundary values', () => {
      const collection_1 = [100, 50, 1]; // max to min
      const collection_2 = [1, 50, 100]; // min to max
      const collection_3 = [1, 50, 100]; // min to max

      const result = merge(collection_1, collection_2, collection_3);

      expect(result).toEqual([1, 1, 1, 50, 50, 50, 100, 100, 100]);
    });
  });
});
