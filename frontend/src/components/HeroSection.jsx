import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleGeneration = () => {
    navigate("/generate");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Your complete brand.
          <br />
          One prompt away.
        </h1>

        <p className="hero-description">
          Generate professional logos, color palettes, and brand guidelines
          tailored to your vision. No design skills required.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleGeneration}>
            Start Forging
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => scrollToSection("features")}
          >
            View Features
          </button>
        </div>
      </div>
    </section>
  );
}
