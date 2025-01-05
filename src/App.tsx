import { useState } from "react";
import FantasyWrappedStory from "./pages/Insight";
import WelcomePage from "./pages/WelcomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? <FantasyWrappedStory /> : <WelcomePage setIsLoggedIn={setIsLoggedIn}/>;
}

export default App;
