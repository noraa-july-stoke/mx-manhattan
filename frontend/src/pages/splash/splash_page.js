import React, { useEffect } from "react";
import { startAnimation } from "./flow_field";
import "./splash_page.css";

const SplashPage = ({ handleFadeOut, isFadingOut }) => {
  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <div
      className={`splashContainer ${isFadingOut ? "fade-out" : ""}`}
      onClick={handleFadeOut}>
      <canvas id="canvas1" style={{ width: "100%", height: "100%" }}></canvas>
      <span className="rubik-mono-one-regular">- click to enter -</span>
    </div>
  );
};

export default SplashPage;
