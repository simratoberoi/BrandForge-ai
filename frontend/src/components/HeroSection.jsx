import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleGeneration = () => {
    const token = localStorage.getItem("authToken");
    navigate(token ? "/generate" : "/login");
  };

  const handleOpenMyGenerations = () => {
    const token = localStorage.getItem("authToken");
    navigate(token ? "/my-generations" : "/login");
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          One image.
          <br />
          Unlimited marketing.
        </h1>

        <p className="hero-description">
          Upload your product and generate studio-quality ads, lifestyle scenes,
          and social creatives tailored to your brand.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleGeneration}>
            Generate Creatives
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleOpenMyGenerations}
          >
            View Generations
          </button>
        </div>
      </div>
    </section>
  );
}
