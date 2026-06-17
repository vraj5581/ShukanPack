import "../styles/pages.css";

function About() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header text-center mb-8 fade-in">
          <h1>Our Story</h1>
          <p>Redefining the unboxing experience since 2015.</p>
        </div>

        <div className="section" style={{ padding: "0" }}>
          <div className="about-grid">
            <div className="fade-in delay-100">
              <div className="about-image-placeholder">🏢</div>
            </div>
            <div className="text-content fade-in delay-200">
              <h2 className="about-heading">More Than Just a Box</h2>
              <p className="about-text">
                At ShukanPack, we believe packaging is the physical embodiment
                of your brand. It's the first touchpoint a customer has with
                your product, and it should be memorable.
              </p>
              <p className="about-text">
                Founded in 2015 by a team of designers and engineers, we set out
                to make premium custom packaging accessible to businesses of all
                sizes. Today, we serve over 500 brands worldwide, delivering
                millions of boxes that delight customers.
              </p>

              <div className="stats-grid about-stats">
                <div>
                  <h3 className="stat-number">10+</h3>
                  <p className="stat-label">Years Exp.</p>
                </div>
                <div>
                  <h3 className="stat-number">50+</h3>
                  <p className="stat-label">Team Members</p>
                </div>
                <div>
                  <h3 className="stat-number">25+</h3>
                  <p className="stat-label">Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
