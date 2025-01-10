export default async function handler(req, res) {
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

const fetchLeague = async (leagueId: string) => {
  const league = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`)
    .then((data) => data.json())
    .catch((e) => e);
  return league;
};
