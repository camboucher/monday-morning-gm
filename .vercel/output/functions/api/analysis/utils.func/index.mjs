import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// api/analysis/utils.ts
function calculateExpectedValue(round, slot) {
  return 200 - ((round - 1) * 12 + slot) * 10;
}
function calculateSeasonPoints(stats) {
  return stats.pts_ppr || 0;
}
function calculatePointsAfterTransaction(stats, timestamp) {
  const weekOfTransaction = getWeekFromTimestamp(timestamp);
  return Object.entries(stats).filter(([week]) => parseInt(week) >= weekOfTransaction).reduce((total, [_, pts]) => total + (pts.pts_ppr || 0), 0);
}
function getWeekFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  return 1;
}
function calculateMedian(numbers) {
  const sorted = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}
function insertSorted(array, item, key, maxLength) {
  array.push(item);
  array.sort((a, b) => b[key] - a[key]);
  if (array.length > maxLength) {
    array.pop();
  }
}
export {
  calculateExpectedValue,
  calculateMedian,
  calculatePointsAfterTransaction,
  calculateSeasonPoints,
  getWeekFromTimestamp,
  insertSorted
};
