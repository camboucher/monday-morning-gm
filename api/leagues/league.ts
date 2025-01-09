
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { leagueId } = req.query;
    const league = await fetchLeague(leagueId);
    res.status(200).json({ league });
  }
}

const fetchLeague = async (leagueId: string) => {
  const url = `https://api.sleeper.app/v1/league/${leagueId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
