import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// api/analysis/utils.ts
function calculateMedian(numbers) {
  const sorted = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

// api/analysis/matchups.ts
async function analyzeMatchupLuck(leagueId) {
  try {
    const matchupAnalysis = {};
    const weeklyScores = [];
    for (let week = 1; week <= 17; week++) {
      const matchupsResponse = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`
      );
      const matchups = await matchupsResponse.json();
      const weekScores = matchups.map((m) => m.points);
      const medianScore = calculateMedian(weekScores);
      weeklyScores.push({ week, median: medianScore });
      matchups.forEach((matchup) => {
        const rosterId = matchup.roster_id;
        if (!matchupAnalysis[rosterId]) {
          matchupAnalysis[rosterId] = {
            expectedWins: 0,
            actualWins: 0,
            unluckyLosses: [],
            luckyWins: []
          };
        }
        const wouldBeatCount = weekScores.filter(
          (score) => matchup.points > score
        ).length;
        const expectedWinPct = wouldBeatCount / weekScores.length;
        matchupAnalysis[rosterId].expectedWins += expectedWinPct;
        const opponent = matchups.find(
          (m) => m.matchup_id === matchup.matchup_id && m.roster_id !== rosterId
        );
        if (opponent) {
          const won = matchup.points > opponent.points;
          if (won) {
            matchupAnalysis[rosterId].actualWins++;
            if (matchup.points < medianScore) {
              matchupAnalysis[rosterId].luckyWins.push({
                week,
                points: matchup.points,
                opponentPoints: opponent.points,
                medianScore
              });
            }
          } else if (matchup.points > medianScore) {
            matchupAnalysis[rosterId].unluckyLosses.push({
              week,
              points: matchup.points,
              opponentPoints: opponent.points,
              medianScore
            });
          }
        }
      });
    }
    Object.keys(matchupAnalysis).forEach((rosterId) => {
      const analysis = matchupAnalysis[rosterId];
      analysis.luckRating = analysis.actualWins - analysis.expectedWins;
    });
    return matchupAnalysis;
  } catch (error) {
    console.error("Error analyzing matchup luck:", error);
    throw error;
  }
}
export {
  analyzeMatchupLuck
};
