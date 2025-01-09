import { useEffect, useState } from "react";
import { WelcomePage, LoadingScreen, FantasyWrappedStory } from "./pages";

const SLEEPER_STORAGE_KEY = "sleeper-league-id";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leagueId, setLeagueId] = useState("");

  useEffect(() => {
    try {
      const storageId = localStorage.getItem(SLEEPER_STORAGE_KEY);
      if (storageId) {
        setLeagueId(storageId);
        handleSubmit();
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const leagueData = await fetch(`/api/league?leagueId=${leagueId}`).then(
        (r) => r.json()
      );
      console.log(leagueData);
      if (leagueData) {
        setIsLoggedIn(true);
        setIsLoading(true);
        localStorage.setItem(SLEEPER_STORAGE_KEY, leagueId);
      }
    } catch (e) {
      console.log(e);
      window.alert("Issue logging in. Please make sure you're id is valid and try again")      
    }
  };

  switch (true) {
    case isLoading:
      return <LoadingScreen onLoadingComplete={setIsLoading} />;
    case !isLoggedIn:
      return (
        <WelcomePage
          handleSubmit={handleSubmit}
          leagueId={leagueId}
          setLeagueId={setLeagueId}
        />
      );
    default:
      return <FantasyWrappedStory />;
  }
}

export default App;
