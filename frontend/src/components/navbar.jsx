import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "gallery"];
      let currentSection = "home";

      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = section;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(id);
  };

  const handleSignUp = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar-pill">
      <div className="navbar-container">
        <div className="navbar-logo">BrandForge</div>

        <div className="navbar-links">
          <button
            className={`navbar-link ${activeSection === "home" ? "active" : ""}`}
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>
          <button
            className={`navbar-link ${activeSection === "features" ? "active" : ""}`}
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          <button
            className={`navbar-link ${activeSection === "gallery" ? "active" : ""}`}
            onClick={() => scrollToSection("gallery")}
          >
            Gallery
          </button>
        </div>

        <button className="navbar-generate" onClick={handleSignUp}>
          Log In
        </button>
      </div>
    </nav>
  );
}
