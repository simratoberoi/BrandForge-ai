import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/navbar.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Generate from "./Generate.jsx";

const HomeWithNav = () => (
  <>
    <Navbar />
    <Home />
  </>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeWithNav />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
