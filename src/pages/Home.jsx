import "../styles/pages.css";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";

function Home() {
  useSEO({
    title: "Shukan Packaging | Premium Custom Packaging & Corrugated Box Manufacturer Morbi",
    description: "Shukan Packaging in Morbi, Gujarat manufactures high-quality custom corrugated boxes, sheets, and custom packaging solutions for sanitaryware, tiles, agriculture, and shipping.",
    keywords: "corrugated boxes, custom packaging, packaging box manufacturer, Morbi packaging, sanitaryware boxes, shipping boxes, Gujarat packaging",
  });

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-shape"></div>
        <div className="container hero-container">
          <div className="hero-content fade-in">
            <span className="badge">Premium Packaging Solution</span>
            <h1>
              Elevate Your Brand With{" "}
              <span className="text-gradient">Custom Packaging</span>
            </h1>
            <p>
              ShukanPack creates high-quality, sustainable, and custom-designed
              packaging that tells your brand's unique story.
            </p>

            <div className="hero-buttons">
              <Link to="/contact" className="primary-btn">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="hero-visual fade-in delay-200">
            {/* Abstract Box Representation */}
            <div className="floating-box">
              <div className="box-face front">
                <img 
                  src={`${import.meta.env.BASE_URL || "/"}logo.jpg`} 
                  alt="Shukan Packaging" 
                  className="box-logo-img" 
                />
              </div>
              <div className="box-face top"></div>
              <div className="box-face right"></div>
            </div>
            <div className="box-shadow"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-item fade-in delay-100">
            <h3>500+</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-item fade-in delay-200">
            <h3>10k+</h3>
            <p>Boxes Delivered</p>
          </div>
          <div className="stat-item fade-in delay-300">
            <h3>24h</h3>
            <p>Support</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section">
        <div className="container">
          <div className="section-header text-center mb-8 fade-in">
            <h2>Our Capabilities</h2>
            <p>End-to-end solutions for all your custom packaging needs.</p>
          </div>

          <div className="process-steps">
            <div className="process-step fade-in delay-100">
              <div className="process-icon-wrapper">
                <svg className="process-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <circle cx="18" cy="15" r="3" />
                  <line x1="20.2" y1="17.2" x2="22.5" y2="19.5" />
                </svg>
              </div>
              <h4>Industry Expertise</h4>
              <p>Tailored insight and expert planning for your market sector.</p>
            </div>

            <div className="process-line"></div>

            <div className="process-step fade-in delay-200">
              <div className="process-icon-wrapper">
                <svg className="process-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  <path d="M15 5l4 4" />
                  <path d="m19 13.5-3 3m1-7.5-6.5 6.5m1.5-6.5-6.5 6.5" />
                </svg>
              </div>
              <h4>Concept + Design</h4>
              <p>Translating ideas into premium structural shapes and graphics.</p>
            </div>

            <div className="process-line"></div>

            <div className="process-step fade-in delay-300">
              <div className="process-icon-wrapper">
                <svg className="process-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="3" />
                  <path d="M8 5h6c2.2 0 4 1.8 4 4v2" />
                  <circle cx="8" cy="16" r="3" />
                  <path d="M8 13h6c2.2 0 4 1.8 4 4v2" />
                  <path d="M18 11l4 4-4 4" />
                </svg>
              </div>
              <h4>Manufacture</h4>
              <p>Precision printing and high-grade fabrication at scale.</p>
            </div>

            <div className="process-line"></div>

            <div className="process-step fade-in delay-400">
              <div className="process-icon-wrapper">
                <svg className="process-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="7" y="3" width="10" height="9" rx="1" />
                  <path d="M7 8h10" />
                  <path d="M12 3v5" />
                  <path d="M2 15h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
                  <circle cx="6" cy="17" r="1.5" />
                  <circle cx="12" cy="17" r="1.5" />
                  <circle cx="18" cy="17" r="1.5" />
                </svg>
              </div>
              <h4>Co-Packing + Supplies</h4>
              <p>Assembly, custom packing, and inventory management support.</p>
            </div>

            <div className="process-line"></div>

            <div className="process-step fade-in delay-500">
              <div className="process-icon-wrapper">
                <svg className="process-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8v16z" />
                  <path d="M14 6h4l4 4v6a2 2 0 0 1-2 2h-6V6z" />
                  <circle cx="7.5" cy="18.5" r="2.5" />
                  <circle cx="16.5" cy="18.5" r="2.5" />
                  <path d="M6 7l2.5 2.5L6 12" />
                  <path d="M9.5 7l2.5 2.5-2.5 2.5" />
                </svg>
              </div>
              <h4>Distribution + Logistics</h4>
              <p>Reliable shipping, tracking, and delivery directly to your locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-content fade-in">
          <h2>Ready to Transform Your Packaging?</h2>
          <p>Join hundreds of brands that trust ShukanPack.</p>
          <Link to="/contact" className="primary-btn white-btn">
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
