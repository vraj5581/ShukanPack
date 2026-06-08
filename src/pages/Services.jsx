import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/pages.css";

function Services() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to ensure DOM is ready/rendering is complete
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight-card");
          setTimeout(() => {
            element.classList.remove("highlight-card");
          }, 2000);
        }
      }, 100);
    }
  }, [hash]);

  const services = [
    {
      title: "Custom Box Design",
      id: "custom-packaging", // Explicit ID to match footer links
      description:
        "Get packaging that fits your product perfectly. We design custom structures that protect and impress.",
      icon: "📦",
    },
    {
      title: "Eco-Friendly Materials",
      id: "eco-materials",
      description:
        "Sustainable solutions using 100% recycled and biodegradable materials without compromising quality.",
      icon: "🌿",
    },
    {
      title: "Branding & prototyping",
      id: "box-design",
      description:
        "Visualize your final product with our high-fidelity 3D mockups and physical prototypes.",
      icon: "🎨",
    },
    {
      title: "Bulk Production",
      id: "bulk-production",
      description:
        "Scalable manufacturing capabilities to handle orders from 100 to 1 million units.",
      icon: "🏭",
    },
    {
      title: "Fulfillment Services",
      id: "fulfillment",
      description:
        "We handle kitting, assembly, and direct shipping to your customers or distribution centers.",
      icon: "🚚",
    },
    {
      title: "Luxury Finishing",
      id: "finishing",
      description:
        "Add value with foil stamping, embossing, spot UV, and soft-touch coatings.",
      icon: "✨",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header text-center mb-8 fade-in">
          <span
            className="badge"
            style={{
              color: "var(--primary-color)",
              background: "#eff6ff",
              borderColor: "#dbeafe",
            }}
          >
            Our Expertise
          </span>
          <h1>Premium Services</h1>
          <p>Comprehensive packaging solutions for every industry.</p>
        </div>

        <div className="features-grid">
          {services.map((service, index) => (
            <div
              id={service.id}
              className={`feature-card fade-in delay-${((index % 3) + 1) * 100}`}
              key={index}
            >
              <div className="icon-box">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
