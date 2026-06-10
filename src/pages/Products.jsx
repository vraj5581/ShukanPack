import { useState } from "react";
import "../styles/pages.css";

function Products() {
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    quantity: "1000",
    dimensions: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const defaultProducts = [
    {
      id: "wc-box",
      title: "Premium Water Closet (WC) Box",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}wc_packaging.png`,
      shortDesc: "Heavy-duty load-bearing packaging engineered for one-piece and wall-hung toilet suites.",
      longDesc: "Our Premium Water Closet boxes are engineered to support massive weight limits, allowing up to 12 levels of vertical stacking in warehouses. Built with reinforced 7-ply corrugated board, these boxes prevent warping or crushing under load. Moisture-resistant outer liners shield fragile sanitaryware from humid climates and ocean shipping.",
      specs: {
        boardGrade: "7-Ply Heavy Duty Kraft",
        fluteProfile: "A + B + C Flute Combination",
        loadCapacity: "Up to 80 kg",
        stackingLimit: "Stacking up to 12 units",
        cushioning: "Pre-folded heavy corrugated buffer inserts",
        moistureResistance: "High (Wax-coated inner liner optional)",
      },
    },
    {
      id: "basin-box",
      title: "Wash Basin Box Set",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}basin_packaging.png`,
      shortDesc: "Protective packaging solutions for counter-top, pedestal, and wall-hung wash basins.",
      longDesc: "Wash basins have delicate curves and thin edges that chip easily. Our Wash Basin boxes incorporate specialized custom-molded interior spacers and honeycomb padding that suspend the basin within the box, absorbing transit shocks. Hand-holes on both sides ensure safe manual loading and unloading.",
      specs: {
        boardGrade: "5-Ply Double Wall Kraft",
        fluteProfile: "B + C Flute",
        loadCapacity: "Up to 35 kg",
        stackingLimit: "Stacking up to 8 units",
        cushioning: "Corrugated edge-guards & honeycomb spacer rings",
        moistureResistance: "Medium-High",
      },
    },
    {
      id: "urinal-box",
      title: "Urinal Carton Box",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}basin_packaging.png`,
      shortDesc: "Die-cut custom containers for flat-back and corner urinal bowls.",
      longDesc: "Urinal bowls have irregular geometries that make packing difficult. Our custom die-cut boxes are tailored specifically to the urinal profile. Cardboard support blocks fit around the mounting ears and water inlet points, locking the product securely in place and preventing shifting during transit.",
      specs: {
        boardGrade: "5-Ply Corrugated",
        fluteProfile: "B + C Flute",
        loadCapacity: "Up to 20 kg",
        stackingLimit: "Stacking up to 6 units",
        cushioning: "Die-cut interlocking spacer templates",
        moistureResistance: "Medium-High",
      },
    },
    {
      id: "pedestal-box",
      title: "Premium Pedestal Box Set",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}wc_packaging.png`,
      shortDesc: "Dual-compartment boxes engineered for pedestal columns and sink fittings.",
      longDesc: "Pedestals require structural packaging that holds columns vertical. This dual-compartment box set features reinforced corner posts that protect from lateral crushing. Separate cardboard channels keep the pedestal base and basin connection points protected from scuffing against each other.",
      specs: {
        boardGrade: "7-Ply Heavy Duty",
        fluteProfile: "A + B Flute",
        loadCapacity: "Up to 50 kg",
        stackingLimit: "Stacking up to 8 units",
        cushioning: "Corner post protectors & vertical dividers",
        moistureResistance: "High",
      },
    },
    {
      id: "fruit-box",
      title: "Ventilated Fruit Box",
      category: "other",
      image: `${import.meta.env.BASE_URL || "/"}fruit_box.png`,
      shortDesc: "Specially ventilated, high-strength corrugated boxes for fresh farm produce transportation.",
      longDesc: "Our Fruit Packaging boxes are designed to preserve freshness and sustain high humidity in cold storage units. They feature custom-placed ventilation holes to allow air circulation and die-cut hand-grips for easy manual handling. Constructed using food-safe kraft paper and moisture-resistant gluing, these boxes maintain structural integrity during stacked transport.",
      specs: {
        boardGrade: "5-Ply Premium Virgin Kraft",
        fluteProfile: "B + E Flute Combination",
        loadCapacity: "Up to 15 kg",
        stackingLimit: "Stacking up to 10 units",
        cushioning: "Integrated side buffers and partition slots",
        moistureResistance: "Very High (Water-repellent barrier)",
      },
    },
    {
      id: "carton-box",
      title: "Universal Carton Box",
      category: "other",
      image: `${import.meta.env.BASE_URL || "/"}carton_box.png`,
      shortDesc: "Standard high-utility shipping cartons designed for safe storage and heavy-duty logistics.",
      longDesc: "Universal Carton boxes (RSC design) are the backbone of secure shipping. Made from high-bursting-strength corrugated boards, they protect heavy or bulky products. Perfect for storage, e-commerce, and industrial shipping. These boxes can be customized with client logos, tape guides, and special folding flaps for quick assembly.",
      specs: {
        boardGrade: "5-Ply or 7-Ply Industrial Kraft",
        fluteProfile: "A + B Flute",
        loadCapacity: "Up to 45 kg",
        stackingLimit: "Stacking up to 8 units",
        cushioning: "Standard corrugated cushion flaps",
        moistureResistance: "Medium-High",
      },
    },
    {
      id: "export-box",
      title: "Heavy-Duty Custom Export Shipper",
      category: "other",
      image: `${import.meta.env.BASE_URL || "/"}export_box.png`,
      shortDesc: "Multi-wall custom-engineered shipping container for international freight and maximum cargo protection.",
      longDesc: "Our flagship custom export boxes are built to withstand the rigors of ocean and air freight. Constructed with reinforced 7-ply double-wall kraft and heavy fluting, they provide extreme puncture resistance. Inside, custom corner-posts and honeycomb cushioning block shifting and absorb sudden shocks, keeping valuable goods safe.",
      specs: {
        boardGrade: "7-Ply Super-Heavy Duty Kraft",
        fluteProfile: "A + B + C Flute Combination",
        loadCapacity: "Up to 120 kg",
        stackingLimit: "Stacking up to 15 units",
        cushioning: "High-density honeycomb spacer blocks",
        moistureResistance: "High (Wax-coated or laminate lined)",
      },
    },
  ];

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("shukan_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse shukan_products from localStorage, falling back to default.", e);
      }
    }
    localStorage.setItem("shukan_products", JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  const filteredProducts = products.filter(
    (p) => filter === "all" || p.category === filter
  );

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateInquiry = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!formData.email.includes("@")) errors.email = "Invalid email address";
    if (!formData.quantity.trim() || parseInt(formData.quantity) < 100)
      errors.quantity = "Minimum order quantity is 100 units";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!validateInquiry()) return;

    setIsSubmitting(true);

    // Save to localStorage under contact_messages for admin integration
    const submissionMessage = `Product Quote Request: ${inquiryProduct.title}\n` +
      `Target Dimensions: ${formData.dimensions || "Standard"}\n` +
      `Quantity Needed: ${formData.quantity}\n` +
      `Remarks/Requirements: ${formData.remarks || "None"}`;

    const newSubmission = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      message: submissionMessage,
      date: new Date().toISOString(),
      status: "unread",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("contact_messages") || "[]");
      localStorage.setItem("contact_messages", JSON.stringify([newSubmission, ...existing]));

      setTimeout(() => {
        setSuccess(true);
        setIsSubmitting(false);
        setFormData({
          name: "",
          email: "",
          quantity: "1000",
          dimensions: "",
          remarks: "",
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header text-center mb-8 fade-in">
          <span className="badge" style={{ color: "var(--primary-color)", background: "#eff6ff", borderColor: "#dbeafe" }}>
            Morbi Packaging Specialists
          </span>
          <h1>Our Packaging Products</h1>
          <p>Heavy-duty, custom-designed corrugated packaging solutions for sanitaryware and general shipping.</p>
        </div>

        {/* Filter Tabs */}
        <div className="product-tabs fade-in delay-100">
          <button
            className={`tab-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Products
          </button>
          <button
            className={`tab-btn ${filter === "sanitaryware" ? "active" : ""}`}
            onClick={() => setFilter("sanitaryware")}
          >
            Sanitaryware Packaging
          </button>
          <button
            className={`tab-btn ${filter === "other" ? "active" : ""}`}
            onClick={() => setFilter("other")}
          >
            Other & Retail Packaging
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid fade-in delay-200">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
                <span className={`product-badge ${product.category}`}>
                  {product.category === "sanitaryware" ? "Sanitaryware" : "Other & Retail"}
                </span>
              </div>
              <div className="product-card-body">
                <h3>{product.title}</h3>
                <p className="product-short-desc">{product.shortDesc}</p>
                <div className="product-specs-brief">
                  <span>🛠️ {product.specs.boardGrade}</span>
                  <span>⚖️ {product.specs.stackingLimit}</span>
                </div>
                <div className="product-card-actions">
                  <button
                    className="product-btn outline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Specs
                  </button>
                  <button
                    className="product-btn solid"
                    onClick={() => {
                      setInquiryProduct(product);
                      setSuccess(false);
                    }}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specs Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>&times;</button>
            <div className="product-modal-grid">
              <div className="modal-image-panel">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>
              <div className="modal-info-panel">
                <span className={`product-badge ${selectedProduct.category}`}>
                  {selectedProduct.category === "sanitaryware" ? "Sanitaryware" : "Other & Retail"}
                </span>
                <h2>{selectedProduct.title}</h2>
                <p className="modal-desc">{selectedProduct.longDesc}</p>
                
                <h4 className="spec-heading">Technical Specifications</h4>
                <div className="specs-table">
                  <div className="spec-row">
                    <span className="spec-label">Board Grade</span>
                    <span className="spec-value">{selectedProduct.specs.boardGrade}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Flute Profile</span>
                    <span className="spec-value">{selectedProduct.specs.fluteProfile}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Load Capacity</span>
                    <span className="spec-value">{selectedProduct.specs.loadCapacity}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Stacking Limit</span>
                    <span className="spec-value">{selectedProduct.specs.stackingLimit}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Cushioning</span>
                    <span className="spec-value">{selectedProduct.specs.cushioning}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Moisture Resistance</span>
                    <span className="spec-value">{selectedProduct.specs.moistureResistance}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="product-btn solid"
                    onClick={() => {
                      setInquiryProduct(selectedProduct);
                      setSelectedProduct(null);
                      setSuccess(false);
                    }}
                  >
                    Inquire for this Box
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Inquiry Modal */}
      {inquiryProduct && (
        <div className="modal-overlay" onClick={() => setInquiryProduct(null)}>
          <div className="inquiry-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInquiryProduct(null)}>&times;</button>
            
            {success ? (
              <div className="inquiry-success-state text-center">
                <div className="inquiry-success-circle">✓</div>
                <h2>Quote Request Sent!</h2>
                <p>We have received your inquiry for the <strong>{inquiryProduct.title}</strong>. Our team in Morbi will contact you within 24 hours with pricing and details.</p>
                <button className="product-btn solid" onClick={() => setInquiryProduct(null)} style={{ marginTop: "24px" }}>
                  Back to Products
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="inquiry-form-body">
                <h2>Request Quote</h2>
                <p className="inquiry-subtitle">Pricing request for: <strong>{inquiryProduct.title}</strong></p>

                <div className="inquiry-form-grid">
                  <div className="form-group-inquiry">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInquiryChange}
                      className={formErrors.name ? "error-border" : ""}
                    />
                    {formErrors.name && <span className="error-text-small">{formErrors.name}</span>}
                  </div>

                  <div className="form-group-inquiry">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInquiryChange}
                      className={formErrors.email ? "error-border" : ""}
                    />
                    {formErrors.email && <span className="error-text-small">{formErrors.email}</span>}
                  </div>

                  <div className="form-group-inquiry">
                    <label>Target Dimensions (L x W x H in mm)</label>
                    <input
                      type="text"
                      name="dimensions"
                      placeholder="e.g. 600x450x450"
                      value={formData.dimensions}
                      onChange={handleInquiryChange}
                    />
                  </div>

                  <div className="form-group-inquiry">
                    <label>Quantity Needed *</label>
                    <input
                      type="number"
                      name="quantity"
                      min="100"
                      value={formData.quantity}
                      onChange={handleInquiryChange}
                      className={formErrors.quantity ? "error-border" : ""}
                    />
                    {formErrors.quantity && <span className="error-text-small">{formErrors.quantity}</span>}
                  </div>
                </div>

                <div className="form-group-inquiry full-width">
                  <label>Special Requirements / Custom Printing</label>
                  <textarea
                    name="remarks"
                    placeholder="Describe any branding, logo prints, honeycomb insert requirements, or thickness specifications."
                    value={formData.remarks}
                    onChange={handleInquiryChange}
                  />
                </div>

                <div className="inquiry-submit-row">
                  <button type="button" className="product-btn outline" onClick={() => setInquiryProduct(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="product-btn solid" disabled={isSubmitting}>
                    {isSubmitting ? <span className="loading-spinner-sm"></span> : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
