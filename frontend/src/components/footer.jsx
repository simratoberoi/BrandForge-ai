import { useState } from "react";
import CurvedLoop from "./CurvedLoop";
import "./footer.css";

export default function Footer() {
  const [hoverLink, setHoverLink] = useState(null);

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "Features", id: "features" },
    { label: "Gallery", id: "gallery" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer" id="footer">
      <CurvedLoop
        marqueeText="BrandForge • AI Product Mockups • Lifestyle Scenes • Studio Ads • Landing Page Heroes • Social Creatives • "
        speed={2}
        className="footer-marquee"
        curveAmount={250}
        direction="left"
        interactive={true}
      />

      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">About</h3>
            <p className="footer-description">
              BrandForge helps teams transform simple product photos into
              campaign-ready visuals. Generate mockups, ad concepts, and
              channel-specific creatives without running a full production
              shoot.
            </p>
          </div>

          <div className="footer-section footer-links-wrapper">
            <h3 className="footer-title">Quick Links</h3>
            <nav className="footer-links">
              {quickLinks.map((link) => (
                <a
                  key={link.id}
                  className="footer-link"
                  onClick={() => scrollToSection(link.id)}
                  onMouseEnter={() => setHoverLink(link.id)}
                  onMouseLeave={() => setHoverLink(null)}
                  style={{
                    opacity:
                      hoverLink === null || hoverLink === link.id ? 1 : 0.5,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-text">
            © 2026 BrandForge. Built to accelerate product marketing design with
            AI-generated creatives for web, social, and performance campaigns.
          </p>
          <p className="footer-credit">Designed for modern product teams.</p>
        </div>
      </div>
    </footer>
  );
}
