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
function insertSorted(array, item, key, maxLength) {
  array.push(item);
  array.sort((a, b) => b[key] - a[key]);
  if (array.length > maxLength) {
    array.pop();
  }
}

// api/analysis/draft.ts
async function analyzeDraftValue(leagueId) {
  try {
    const draftResponse = await fetch(
      `https://api.sleeper.app/v1/draft/${leagueId}/picks`
    );
    const draftPicks = await draftResponse.json();
    const statsResponse = await fetch(
      `https://api.sleeper.app/v1/stats/nfl/regular/2024`
    );
    const seasonStats = await statsResponse.json();
    const draftAnalysis = {};
    draftPicks.forEach((pick) => {
      const playerStats = seasonStats[pick.player_id];
      if (!playerStats) return;
      const expectedPoints = calculateExpectedValue(
        pick.round,
        pick.draft_slot
      );
      const actualPoints = calculateSeasonPoints(playerStats);
      const valueOverExpected = actualPoints - expectedPoints;
      if (!draftAnalysis[pick.picked_by]) {
        draftAnalysis[pick.picked_by] = {
          totalValueOverExpected: 0,
          bestPicks: [],
          worstPicks: []
        };
      }
      draftAnalysis[pick.picked_by].totalValueOverExpected += valueOverExpected;
      const pickAnalysis = {
        player_id: pick.player_id,
        round: pick.round,
        valueOverExpected
      };
      const picks = draftAnalysis[pick.picked_by].bestPicks;
      insertSorted(picks, pickAnalysis, "valueOverExpected", 3);
    });
    return draftAnalysis;
  } catch (error) {
    console.error("Error analyzing draft:", error);
    throw error;
  }
}
export {
  analyzeDraftValue
};
