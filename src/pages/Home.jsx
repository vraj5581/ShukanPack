import "../styles/pages.css";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import AnimatedCounter from "../components/AnimatedCounter";

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

      {/* Capabilities Section */}
      <section className="section capabilities-section">
        <div className="container">
          <div className="section-header text-center mb-8 fade-in">
            <span className="badge">Our Capabilities</span>
            <h2>Packaging Workflow</h2>
            <p>End-to-end custom packaging workflow tailored for industrial excellence.</p>
          </div>

          <div className="capabilities-grid">
            <div className="capability-card fade-in delay-100">
              <div className="capability-step-num">01</div>
              <div className="capability-icon-wrapper">
                <svg className="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                  <path d="M12 22.08V12" />
                  <line x1="8" y1="14.28" x2="8" y2="17.28" />
                  <line x1="4" y1="12" x2="4" y2="15" />
                </svg>
              </div>
              <h4 className="capability-title">Packaging Consultation</h4>
              <p className="capability-desc">Understand product dimensions and requirements.</p>
            </div>

            <div className="capability-card fade-in delay-200">
              <div className="capability-step-num">02</div>
              <div className="capability-icon-wrapper">
                <svg className="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeDasharray="3 3" />
                  <path d="M17 3L7 13" />
                  <path d="M3 21l3-3 3 3-3-3z" />
                  <path d="M9 11l4-4 4 4-4 4z" fill="currentColor" fillOpacity="0.1" />
                  <path d="M5 8h14M5 16h14M8 5v14M16 5v14" />
                </svg>
              </div>
              <h4 className="capability-title">Custom Box Design</h4>
              <p className="capability-desc">Structural design and branding development.</p>
            </div>

            <div className="capability-card fade-in delay-300">
              <div className="capability-step-num">03</div>
              <div className="capability-icon-wrapper">
                <svg className="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 7v10l10 5V12L2 7Z" fill="currentColor" fillOpacity="0.1" />
                  <path d="M22 7v10l-10 5V12l10-5Z" />
                  <path d="M12 2v10" strokeDasharray="2 2" />
                </svg>
              </div>
              <h4 className="capability-title">Sample Development</h4>
              <p className="capability-desc">Prototype creation and approval process.</p>
            </div>

            <div className="capability-card fade-in delay-400">
              <div className="capability-step-num">04</div>
              <div className="capability-icon-wrapper">
                <svg className="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="6" r="3" />
                  <path d="M3 13h18l-3 6H6l-3-6Z" />
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" fill="currentColor" fillOpacity="0.1" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
              </div>
              <h4 className="capability-title">Production & QC</h4>
              <p className="capability-desc">Precision manufacturing with strict quality check.</p>
            </div>

            <div className="capability-card fade-in delay-500">
              <div className="capability-step-num">05</div>
              <div className="capability-icon-wrapper">
                <svg className="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                  <path d="M15 2a6 6 0 0 1 6 6v1a2 2 0 0 1-2 2h-1" />
                </svg>
              </div>
              <h4 className="capability-title">Delivery & Support</h4>
              <p className="capability-desc">Safe dispatch and ongoing customer support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="home-stats-grid">
            <div className="stat-item fade-in delay-100">
              <h3>
                <AnimatedCounter value={500} suffix="+" />
              </h3>
              <p>Happy Clients</p>
            </div>
            <div className="stat-item fade-in delay-200">
              <h3>
                <AnimatedCounter value={10} suffix="k+" />
              </h3>
              <p>Boxes Delivered</p>
            </div>
            <div className="stat-item fade-in delay-300">
              <h3>
                <AnimatedCounter value={24} suffix="h" />
              </h3>
              <p>Support</p>
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
