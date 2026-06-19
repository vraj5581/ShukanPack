import "../styles/pages.css";
import useSEO from "../hooks/useSEO";
import AnimatedCounter from "../components/AnimatedCounter";

function About() {
  useSEO({
    title: "About Us | Shukan Packaging - Morbi Custom Box Manufacturer",
    description: "Learn about Shukan Packaging, a premier designer and manufacturer of custom corrugated boxes, packaging sheets, and custom packing supplies in Morbi, Gujarat since 2015.",
    keywords: "about shukan packaging, box factory morbi, packaging manufacturer, custom corrugated sheets, gujarat corrugated box",
  });
  return (
    <div className="page-wrapper">
      <div className="about-container">
        
        {/* Hero Section */}
        <div className="about-hero text-center fade-in">
          <span className="about-accent-badge">Since 2015</span>
          <h1 className="about-hero-title">Our Story</h1>
          <p className="about-hero-subtitle">
            Redefining the unboxing experience through premium craftsmanship, innovative structural design, and custom packaging solutions.
          </p>
          <div className="about-hero-glow"></div>
        </div>

        {/* Content Section (Grid) */}
        <div className="about-content-grid">
          <div className="about-visual-column fade-in delay-100">
            <div className="about-image-frame">
              <img src={`${import.meta.env.BASE_URL || "/"}about-studio.png`} alt="Shukan Packaging Studio" className="about-image" />
              <div className="about-image-glow"></div>
            </div>
          </div>
          
          <div className="about-text-column fade-in delay-200">
            <span className="about-text-badge">Manufacturing Excellence</span>
            <h2 className="about-section-title">More Than Just a Box</h2>
            <p className="about-paragraph">
              At ShukanPack, we believe packaging is the physical embodiment of your brand. It is the very first tactile touchpoint a customer has with your product, representing a critical moment to build trust, convey quality, and leave a premium, memorable impression.
            </p>
            <p className="about-paragraph">
              Founded in Morbi, Gujarat, we set out to make enterprise-grade custom packaging accessible to growing businesses and global brands alike. Today, we serve over 500 brands worldwide, delivering millions of custom boxes engineered for strength and designed for visual delight.
            </p>
            <p className="about-paragraph">
              Our production facility utilizes state-of-the-art machinery and premium raw materials to manufacture durable corrugated boxes, custom sheets, and heavy-duty shipping solutions. We maintain absolute precision at every phase, from structural prototyping to final volume production.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="about-stats-section fade-in delay-300">
          <div className="about-stats-grid">
            
             <div className="about-stat-card">
              <div className="about-stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="about-stat-icon">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <h3 className="about-stat-number">
                <AnimatedCounter value={10} suffix="+" />
              </h3>
              <p className="about-stat-label">Years Experience</p>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="about-stat-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="about-stat-number">
                <AnimatedCounter value={50} suffix="+" />
              </h3>
              <p className="about-stat-label">Team Members</p>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="about-stat-icon">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                  <polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08" />
                  <polygon points="12 12 21 6.92 21 17.08 12 22.08" />
                  <polygon points="12 2 21 6.92 12 12 3 6.92 12 2" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="about-stat-number">
                <AnimatedCounter value={500} suffix="+" />
              </h3>
              <p className="about-stat-label">Projects Delivered</p>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="about-stat-icon">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="about-stat-number">
                <AnimatedCounter value={100} suffix="+" />
              </h3>
              <p className="about-stat-label">Happy Clients</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default About;
