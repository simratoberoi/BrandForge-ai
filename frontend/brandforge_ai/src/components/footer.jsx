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
        marqueeText="BrandForge • Crafting Digital Identities • AI-Powered Design Solutions • "
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
              BrandForge is a demonstration project created for educational and
              practice purposes. This platform showcases advanced web design
              techniques and AI-powered branding concepts in a futuristic
              environment.
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
            © 2026 BrandForge. This project is maintained solely for educational
            and portfolio development purposes. All design elements and
            functionalities are demonstrations of web development capabilities.
          </p>
          <p className="footer-credit">
            Designed & developed for practice and learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
