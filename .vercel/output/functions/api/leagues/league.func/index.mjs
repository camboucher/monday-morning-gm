import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// api/leagues/league.ts
async function handler(req, res) {
  console.log("Hello from vercel");
  if (req.method === "GET") {
    try {
      const { leagueId } = req.query;
      const league = await fetchLeague(leagueId);
      console.log(league);
      return res.status(200).json({ league });
    } catch (e) {
      console.log(e);
    }
  }
}
var fetchLeague = async (leagueId) => {
  const league = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`).then((data) => data.json()).catch((e) => e);
  return league;
};
export {
  handler as default
};
