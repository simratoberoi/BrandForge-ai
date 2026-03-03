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
      title: "AI Logo Creation",
      description:
        "Tell us your brand name and vibe. We generate a professional, scalable logo designed to match your industry, tone, and target audience — ready for web, social media, and print use.",
    },
    {
      title: "LinkedIn Banner Design",
      description:
        "Stand out on LinkedIn with a banner that aligns perfectly with your brand identity. Your colors, typography, and messaging are automatically applied to create a cohesive and professional presence.",
    },
    {
      title: "Smart Color Palette",
      description:
        "We create a balanced, modern color system tailored to your brand personality — including primary, secondary, and accent colors with hex codes that are ready to use across all platforms.",
    },
    {
      title: "Branding Guidelines",
      description:
        "Receive a clean, structured brand guide explaining logo usage, spacing, typography rules, and color applications — so your brand remains consistent everywhere it appears.",
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
