import { useRef } from "react";
import "./features.css";

const FeatureCard = ({ title, description }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className="feature-card">
      <div className="feature-card-content">
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
      </div>
    </div>
  );
};

export default function Features() {
  const features = [
    {
      title: "Product-To-Mockup Engine",
      description:
        "Upload a bottle, sneaker, gadget, or any product image and get polished marketing-ready mockups with realistic shadows, reflections, and composition.",
    },
    {
      title: "Lifestyle Scene Generation",
      description:
        "Place your product in natural environments like desk setups, gym spaces, kitchen counters, or outdoor moments that feel authentic and conversion-driven.",
    },
    {
      title: "Multi-Channel Ad Outputs",
      description:
        "Create studio ads, landing page hero visuals, and social media creatives in the right dimensions for paid campaigns, websites, and organic posts.",
    },
    {
      title: "Prompt-Controlled Art Direction",
      description:
        "Guide composition, mood, background style, and lighting with prompts so every generated creative matches your campaign concept and audience.",
    },
  ];

  return (
    <section id="features" className="features-section">
      <h2 className="features-heading">Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
