export function calculateExpectedValue(round: number, slot: number): number {
  // Simplified expected value calculation based on draft position
  return 200 - ((round - 1) * 12 + slot) * 10;
}

export function calculateSeasonPoints(stats: any): number {
  // Implement your league's scoring settings here
  return stats.pts_ppr || 0;
}

export function calculatePointsAfterTransaction(
  stats: any,
  timestamp: number
): number {
  // Calculate points scored after the transaction date
  const weekOfTransaction = getWeekFromTimestamp(timestamp);
  return Object.entries(stats)
    .filter(([week]) => parseInt(week) >= weekOfTransaction)
    .reduce((total, [_, pts]) => total + (pts.pts_ppr || 0), 0);
}

export function getWeekFromTimestamp(timestamp: number): number {
  // Convert timestamp to week number
  const date = new Date(timestamp);
  // Implement week calculation based on NFL season
  return 1; // Placeholder
}

export function calculateMedian(numbers: number[]): number {
  const sorted = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function insertSorted(array: any[], item: any, key: string, maxLength: number) {
  array.push(item);
  array.sort((a, b) => b[key] - a[key]);
  if (array.length > maxLength) {
    array.pop();
  }
}
