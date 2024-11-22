import "./App.css";
import { SplashPage, HomePage, LoginPage, AdminPage, AboutPage } from "./pages";
import { NavBar } from "./pages/components";
import SpotifyReleases from "./pages/releases/releases";
import { useState } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleFadeOut = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setHasEntered(true);
    }, 1000); // 1s to match the CSS transition duration
  };

  return (
    <Router>
      <Content
        hasEntered={hasEntered}
        isFadingOut={isFadingOut}
        handleFadeOut={handleFadeOut}
        setToken={setToken}
        token={token}
      />
    </Router>
  );
}

function Content({ hasEntered, isFadingOut, handleFadeOut, setToken, token }) {
  const location = useLocation();

  // Skip the splash page if the current path starts with /admin
  if (!hasEntered && !location.pathname.startsWith("/admin")) {
    return (
      <SplashPage handleFadeOut={handleFadeOut} isFadingOut={isFadingOut} />
    );
  }

  return (
    <>
      <NavBar token={token} /> {/* Pass the token to Navbar */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/releases" element={<SpotifyReleases />} />
        <Route
          path="/admin/login"
          element={<LoginPage setToken={setToken} />}
        />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage />}/>
      </Routes>
    </>
  );
}

export default App;
