import { useState } from "react";
import "../styles/pages.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Save to localStorage
    const newSubmission = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      status: 'unread'
    };

    const existingData = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    localStorage.setItem('contact_messages', JSON.stringify([newSubmission, ...existingData]));

    // Simulate API call delay for UX
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header text-center mb-8 fade-in">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our team is always here to chat.</p>
        </div>

        <div className="contact-layout">
          {/* Animated Info Card */}
          <div className="contact-info-wrapper fade-in delay-200">
            <div className="info-card floating-card">
              <div className="card-content">
                <h3>Contact Information</h3>
                <p className="mb-8">Fill out the form or reach us directly.</p>

                <div className="info-item">
                  <div className="icon-circle">📧</div>
                  <div className="info-text">
                    <label>Email Us</label>
                    <a href="mailto:vraj@shukanpack.com">
                      vraj@shukanpack.com
                    </a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="icon-circle">📞</div>
                  <div className="info-text">
                    <label>Call Us</label>
                    <a href="tel:+917016516703">+91 7016516703</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="icon-circle">📍</div>
                  <div className="info-text">
                    <label>Visit Us</label>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=New+Ghutu+Road,+Morbi,+Gujarat"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      New Ghutu Road,
                      <br />
                      Morbi, Gujarat
                    </a>
                  </div>
                </div>

                <div className="card-decoration">
                  <div className="circle-1"></div>
                  <div className="circle-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="form-container fade-in delay-300">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div
                className={`form-group ${activeField === "name" || formData.name ? "active" : ""}`}
              >
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  className={errors.name ? "error-border" : ""}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div
                className={`form-group ${activeField === "email" || formData.email ? "active" : ""}`}
              >
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  className={errors.email ? "error-border" : ""}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div
                className={`form-group ${activeField === "message" || formData.message ? "active" : ""}`}
              >
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setActiveField("message")}
                  onBlur={() => setActiveField(null)}
                  className={errors.message ? "error-border" : ""}
                />
                {errors.message && (
                  <p className="error-text">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    Send Message
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="18"
                      height="18"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>

              {success && (
                <div className="success-message fade-in">
                  <span className="check-icon">✓</span>
                  <p>Message sent successfully!</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
