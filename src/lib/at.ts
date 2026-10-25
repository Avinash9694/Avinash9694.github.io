/** Index into a list that is known to be long enough; throws instead of yielding undefined. */
export function at<T>(list: readonly T[], index: number): T {
  const value = list[index];
  if (value === undefined) throw new RangeError(`No item at index ${index}`);
  return value;
}
