import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// api/analysis/utils.ts
function calculatePointsAfterTransaction(stats, timestamp) {
  const weekOfTransaction = getWeekFromTimestamp(timestamp);
  return Object.entries(stats).filter(([week]) => parseInt(week) >= weekOfTransaction).reduce((total, [_, pts]) => total + (pts.pts_ppr || 0), 0);
}
function getWeekFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  return 1;
}
function insertSorted(array, item, key, maxLength) {
  array.push(item);
  array.sort((a, b) => b[key] - a[key]);
  if (array.length > maxLength) {
    array.pop();
  }
}

// api/analysis/waivers.ts
async function analyzeWaiverPickups(leagueId, weekStart, weekEnd) {
  try {
    const transactions = [];
    for (let week = weekStart; week <= weekEnd; week++) {
      const response = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`
      );
      const weekTransactions = await response.json();
      transactions.push(...weekTransactions);
    }
    const statsResponse = await fetch(`https://api.sleeper.app/v1/stats/nfl/regular/2024`);
    const seasonStats = await statsResponse.json();
    const waiverAnalysis = {};
    transactions.filter((t) => t.type === "waiver" && t.status === "complete").forEach((transaction) => {
      const rosterId = transaction.roster_ids[0];
      const addedPlayers = Object.keys(transaction.adds || {});
      addedPlayers.forEach((playerId) => {
        const playerStats = seasonStats[playerId];
        if (!playerStats) return;
        const pointsAfterPickup = calculatePointsAfterTransaction(
          playerStats,
          transaction.created
        );
        if (!waiverAnalysis[rosterId]) {
          waiverAnalysis[rosterId] = {
            totalWaiverPoints: 0,
            bestPickups: []
          };
        }
        waiverAnalysis[rosterId].totalWaiverPoints += pointsAfterPickup;
        const pickup = {
          player_id: playerId,
          week: getWeekFromTimestamp(transaction.created),
          points: pointsAfterPickup
        };
        insertSorted(
          waiverAnalysis[rosterId].bestPickups,
          pickup,
          "points",
          3
        );
      });
    });
    return waiverAnalysis;
  } catch (error) {
    console.error("Error analyzing waiver pickups:", error);
    throw error;
  }
}
export {
  analyzeWaiverPickups
};
