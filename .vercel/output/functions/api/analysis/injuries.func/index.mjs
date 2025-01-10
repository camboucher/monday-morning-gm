import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// api/analysis/injuries.ts
async function analyzeInjuryLuck(leagueId) {
  try {
    const injuryAnalysis = {};
    for (let week = 1; week <= 17; week++) {
      const lineupResponse = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/lineups/${week}`
      );
      const lineups = await lineupResponse.json();
      const injuryResponse = await fetch(
        `https://api.sleeper.app/v1/players/nfl/injuries/${week}`
      );
      const injuries = await injuryResponse.json();
      lineups.forEach((lineup) => {
        const rosterId = lineup.roster_id;
        if (!injuryAnalysis[rosterId]) {
          injuryAnalysis[rosterId] = {
            gamesLostToInjury: 0,
            startersLostToInjury: 0,
            significantInjuries: []
          };
        }
        lineup.starters.forEach((playerId) => {
          const injury = injuries[playerId];
          if (injury && injury.status === "Out") {
            injuryAnalysis[rosterId].gamesLostToInjury++;
            injuryAnalysis[rosterId].startersLostToInjury++;
            injuryAnalysis[rosterId].significantInjuries.push({
              player_id: playerId,
              week,
              status: injury.status
            });
          }
        });
      });
    }
    return injuryAnalysis;
  } catch (error) {
    console.error("Error analyzing injuries:", error);
    throw error;
  }
}
export {
  analyzeInjuryLuck
};
