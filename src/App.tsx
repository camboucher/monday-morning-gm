import { useState } from "react";
import { WelcomePage, LoadingScreen, FantasyWrappedStory } from "./pages";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  switch(true) {
    case isLoading:
      return <LoadingScreen onLoadingComplete={setIsLoading}/>
    case !isLoggedIn:
      return <WelcomePage setIsLoggedIn={setIsLoggedIn} setIsLoading={setIsLoading} />
    default:
      return <FantasyWrappedStory />
  }
}

export default App;
