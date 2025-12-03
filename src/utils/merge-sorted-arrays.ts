/**
 * Merges three sorted arrays into one sorted array in ascending order.
 *
 * @param collection_1 - Array sorted from max to min (descending)
 * @param collection_2 - Array sorted from min to max (ascending)
 * @param collection_3 - Array sorted from min to max (ascending)
 * @returns A single array with all elements sorted in ascending order
 *
 * @example
 * ```typescript
 * merge([5, 3, 1], [2, 4, 6], [1, 3, 7])
 * // Returns: [1, 1, 2, 3, 3, 4, 5, 6, 7]
 * ```
 */
export function merge(
  collection_1: number[],
  collection_2: number[],
  collection_3: number[],
): number[] {
  const result: number[] = [];

  // Pointers for each collection
  let i1 = collection_1.length - 1; // Start from end (smallest) for descending array
  let i2 = 0; // Start from beginning (smallest) for ascending array
  let i3 = 0; // Start from beginning (smallest) for ascending array

  // Merge all three arrays using three-way comparison
  while (i1 >= 0 || i2 < collection_2.length || i3 < collection_3.length) {
    const val1 = i1 >= 0 ? collection_1[i1] : Infinity;
    const val2 = i2 < collection_2.length ? collection_2[i2] : Infinity;
    const val3 = i3 < collection_3.length ? collection_3[i3] : Infinity;

    // Find the minimum value among the three
    if (val1 <= val2 && val1 <= val3) {
      result.push(val1);
      i1--;
    } else if (val2 <= val1 && val2 <= val3) {
      result.push(val2);
      i2++;
    } else {
      result.push(val3);
      i3++;
    }
  }

  return result;
}
