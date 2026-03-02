import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Aurora from "./hero.jsx";
import Navbar from "./components/navbar.jsx";
import HeroSection from "./components/HeroSection.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Navbar />
    <Aurora
      colorStops={["#00C9FF", "#92FE9D", "#00C9FF"]}
      blend={0.5}
      amplitude={1.0}
      speed={1}
    />
    <HeroSection />
  </StrictMode>,
);
