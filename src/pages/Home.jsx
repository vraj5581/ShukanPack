import "../styles/pages.css";
import { Link } from "react-router-dom";

function Home() {
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
              <Link to="/services" className="primary-btn">
                Get Started
              </Link>
              <Link to="/contact" className="secondary-btn">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="hero-visual fade-in delay-200">
            {/* Abstract Box Representation */}
            <div className="floating-box">
              <div className="box-face front">
                <div className="box-logo">SP</div>
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

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Why Choose ShukanPack?</h2>
            <p>We deliver perfection in every package.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in delay-100">
              <div className="icon-box">🎨</div>
              <h3>Custom Design</h3>
              <p>
                Unique box designs tailored specifically to your brand identity.
              </p>
            </div>

            <div className="feature-card fade-in delay-200">
              <div className="icon-box">✨</div>
              <h3>Premium Quality</h3>
              <p>High-grade materials with perfect finishing and durability.</p>
            </div>

            <div className="feature-card fade-in delay-300">
              <div className="icon-box">🚀</div>
              <h3>Fast Delivery</h3>
              <p>On-time production and expedited shipping options.</p>
            </div>

            <div className="feature-card fade-in delay-100">
              <div className="icon-box">🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Sustainable materials that respect the environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section">
        <div className="container">
          <div className="section-header text-center mb-8 fade-in">
            <h2>How It Works</h2>
            <p>Simple 3-step process to get your custom boxes.</p>
          </div>

          <div className="process-steps">
            <div className="process-step fade-in delay-100">
              <div className="step-number">01</div>
              <h4>Consultation</h4>
              <p>Discuss your needs and requirements with our experts.</p>
            </div>
            <div className="process-line fade-in delay-100"></div>
            <div className="process-step fade-in delay-200">
              <div className="step-number">02</div>
              <h4>Design & Mockup</h4>
              <p>We create a digital prototype for your approval.</p>
            </div>
            <div className="process-line fade-in delay-200"></div>
            <div className="process-step fade-in delay-300">
              <div className="step-number">03</div>
              <h4>Production</h4>
              <p>We manufacture and ship your premium packaging.</p>
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
