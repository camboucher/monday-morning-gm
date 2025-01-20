import { useCallback, useEffect, useState } from "react";
import { WelcomePage, LoadingScreen, FantasyWrappedStory } from "./pages";

const { API_URL } = process.env;
const SLEEPER_STORAGE_KEY = "sleeper-league-id";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leagueId, setLeagueId] = useState("");

  useEffect(() => {
    try {
      const storageId = localStorage.getItem(SLEEPER_STORAGE_KEY);
      if (storageId?.length) {
        console.log(storageId);
        setLeagueId(storageId);
        handleSubmit(storageId);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleSubmit = useCallback(async (id: string) => {
    try {
      const validateLeagueId = await fetch(`${API_URL}/leagues/${id}`);
      if (validateLeagueId.status === 200) {
        setIsLoggedIn(true);
        setIsLoading(true);
        localStorage.setItem(SLEEPER_STORAGE_KEY, id);
      } else {
        alert(
          "Couldn't fetch league data. Please check that you're leagueId is correct and try again"
        );
      }
    } catch (e) {
      alert("Technical error, please try again");
      console.error(e);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={setIsLoading} />;
  } else if (!isLoggedIn) {
    return (
      <WelcomePage
        handleSubmit={() => handleSubmit(leagueId)}
        leagueId={leagueId}
        setLeagueId={setLeagueId}
      />
    );
  }
  return <FantasyWrappedStory />;
}

export default App;
