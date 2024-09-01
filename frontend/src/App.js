import "./App.css";
import { SplashPage, HomePage } from "./pages";
import { NavBar } from "./pages/components";
import SpotifyReleases from "./pages/releases/releases";
import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFadeOut = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setHasEntered(true);
    }, 1000); // 1s to match the CSS transition duration
  };

  return (
    <div className="App">
      {hasEntered ? (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/releases" element={<SpotifyReleases />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      ) : (
        <SplashPage handleFadeOut={handleFadeOut} isFadingOut={isFadingOut} />
      )}
    </div>
  );
}

export default App;
