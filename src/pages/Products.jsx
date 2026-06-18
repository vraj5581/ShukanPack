import { useState, useEffect } from "react";
import "../styles/pages.css";
import { API_BASE_URL, getHeaders } from "../apiConfig";
import useSEO from "../hooks/useSEO";

const getBriefSpecs = (specs) => {
  const formatVal = (str) => {
    if (!str) return "Standard";
    const colonIndex = str.indexOf(":");
    return colonIndex !== -1 ? str.substring(colonIndex + 1).trim() : str;
  };

  if (Array.isArray(specs)) {
    return {
      spec1: formatVal(specs[0]),
      spec2: formatVal(specs[3] || specs[1] || specs[0])
    };
  } else if (specs && typeof specs === "object") {
    return {
      spec1: specs.boardGrade || "Standard",
      spec2: specs.stackingLimit || "Standard"
    };
  }
  return { spec1: "Standard", spec2: "Standard" };
};

function Products() {
  useSEO({
    title: "Custom Corrugated Products & Box Catalog | Shukan Packaging",
    description: "Browse our premium custom packaging products including heavy-duty sanitaryware box sets, ventilated fresh fruit shippers, custom export shippers, and carton boxes.",
    keywords: "sanitaryware box, Urinal carton box, wash basin box, export shipper box, Universal carton box, ventilated fruit box, custom packaging Morbi",
  });
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    quantity: "",
    dimensions: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/products.php`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products from backend:", err);
        setError("Could not load products. Please check your connection.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    if (!formData.quantity.trim()) {
      errors.quantity = "Quantity is required";
    } else if (parseInt(formData.quantity) <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!validateInquiry()) return;

    setIsSubmitting(true);

    const submissionMessage = `Product Quote Request: ${inquiryProduct.title}\n` +
      `Target Dimensions: ${formData.dimensions || "Standard"}\n` +
      `Quantity Needed: ${formData.quantity}\n` +
      `Remarks/Requirements: ${formData.remarks || "None"}`;

    const newSubmission = {
      name: formData.name,
      email: formData.email,
      message: submissionMessage,
      date: new Date().toISOString(),
      status: "unread",
    };

    fetch(`${API_BASE_URL}/inquiries.php`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(newSubmission),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save submission");
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setIsSubmitting(false);
        setFormData({
          name: "",
          email: "",
          quantity: "",
          dimensions: "",
          remarks: "",
        });
      })
      .catch((err) => {
        console.error("Error submitting quote inquiry:", err);
        alert("Failed to submit quote request. Please check your connection or contact us directly.");
        setIsSubmitting(false);
      });
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
          {loading ? (
            <div className="loading-state text-center" style={{ gridColumn: "1/-1", padding: "40px" }}>
              <div className="loading-spinner" style={{ width: "40px", height: "40px", margin: "0 auto 20px" }}></div>
              <p style={{ color: "var(--text-light)", fontWeight: "500" }}>Loading products from database...</p>
            </div>
          ) : error ? (
            <div className="error-state text-center" style={{ gridColumn: "1/-1", padding: "40px" }}>
              <p style={{ color: "#ef4444", fontWeight: "600", fontSize: "16px" }}>⚠️ {error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state text-center" style={{ gridColumn: "1/-1", padding: "40px" }}>
              <p style={{ color: "var(--text-light)", fontWeight: "500", fontSize: "16px" }}>No products found in this category.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
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
            ))
          )}
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
                <div className="specs-table custom-specs-container" style={{ display: "block" }}>
                  {(() => {
                    let specsList = [];
                    if (Array.isArray(selectedProduct.specs)) {
                      specsList = selectedProduct.specs;
                    } else if (selectedProduct.specs && typeof selectedProduct.specs === "object") {
                      specsList = [
                        selectedProduct.specs.boardGrade && `Board Grade: ${selectedProduct.specs.boardGrade}`,
                        selectedProduct.specs.fluteProfile && `Flute Profile: ${selectedProduct.specs.fluteProfile}`,
                        selectedProduct.specs.loadCapacity && `Load Capacity: ${selectedProduct.specs.loadCapacity}`,
                        selectedProduct.specs.stackingLimit && `Stacking Limit: ${selectedProduct.specs.stackingLimit}`,
                        selectedProduct.specs.cushioning && `Cushioning: ${selectedProduct.specs.cushioning}`,
                        selectedProduct.specs.moistureResistance && `Moisture Resistance: ${selectedProduct.specs.moistureResistance}`,
                      ].filter(Boolean);
                    }

                    return specsList.length > 0 ? (
                      <div className="specs-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {specsList.map((spec, index) => {
                          const colonIndex = spec.indexOf(":");
                          let labelText = "";
                          let valueText = spec;
                          
                          if (colonIndex !== -1) {
                            labelText = spec.substring(0, colonIndex).trim();
                            valueText = spec.substring(colonIndex + 1).trim();
                          }
                          
                          return (
                            <div 
                              key={index} 
                              className="spec-item-row" 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                padding: '12px 16px',
                                background: 'rgba(255, 255, 255, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                              }}
                            >
                              <div 
                                className="spec-num-badge"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '28px',
                                  height: '28px',
                                  background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                                  color: 'white',
                                  borderRadius: '50%',
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  flexShrink: 0
                                }}
                              >
                                {index + 1}
                              </div>
                              <span 
                                style={{ 
                                  fontSize: '14px', 
                                  color: 'var(--text-main)', 
                                  lineHeight: '1.4',
                                  flex: 1
                                }}
                              >
                                {labelText ? (
                                  <>
                                    <strong style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{labelText}:</strong> {valueText}
                                  </>
                                ) : (
                                  spec
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No specifications available.</p>
                    );
                  })()}
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
                      value={formData.dimensions}
                      onChange={handleInquiryChange}
                    />
                  </div>

                  <div className="form-group-inquiry">
                    <label>Quantity Needed *</label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
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
