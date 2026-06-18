import { useState, useEffect, Fragment } from "react";
import "../styles/pages.css"; // Base styles
import "../styles/admin.css"; // Admin specific styles
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getHeaders } from "../apiConfig";
import useSEO from "../hooks/useSEO";

const parseInquiryMessage = (messageText) => {
  if (!messageText) return null;

  const keys = [
    "Product Quote Request",
    "Target Dimensions",
    "Quantity Needed",
    "Remarks/Requirements"
  ];

  const positions = keys.map(key => {
    const index = messageText.indexOf(key + ":");
    return { key, index };
  }).filter(pos => pos.index !== -1);

  if (positions.length > 0) {
    positions.sort((a, b) => a.index - b.index);
    const fields = [];

    for (let i = 0; i < positions.length; i++) {
      const current = positions[i];
      const next = positions[i + 1];
      
      const valStart = current.index + current.key.length + 1;
      const valEnd = next ? next.index : messageText.length;
      
      let value = messageText.substring(valStart, valEnd).trim();
      value = value.replace(/^[\s,]+|[\s,]+$/g, "");
      
      fields.push({
        label: current.key,
        value: value || "N/A"
      });
    }
    return fields;
  }
  return null;
};

function Admin() {
  useSEO({
    title: "Admin Dashboard Portal | Shukan Packaging",
    description: "Secure administrator dashboard for managing product catalogs, inquiries, and customer requests at Shukan Packaging.",
    noindex: true,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'messages' | 'settings' | 'products'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [showFilterBar, setShowFilterBar] = useState(false);

  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const defaults = [
    {
      id: "wc-box",
      title: "Premium Water Closet (WC) Box",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}wc_packaging.png`,
      shortDesc:
        "Heavy-duty load-bearing packaging engineered for one-piece and wall-hung toilet suites.",
      longDesc:
        "Our Premium Water Closet boxes are engineered to support massive weight limits, allowing up to 12 levels of vertical stacking in warehouses. Built with reinforced 7-ply corrugated board, these boxes prevent warping or crushing under load. Moisture-resistant outer liners shield fragile sanitaryware from humid climates and ocean shipping.",
      specs: [
        "Board Grade: 7-Ply Heavy Duty Kraft",
        "Flute Profile: A + B + C Flute Combination",
        "Load Capacity: Up to 80 kg",
        "Stacking Limit: Stacking up to 12 units",
        "Cushioning: Pre-folded heavy corrugated buffer inserts",
        "Moisture Resistance: High (Wax-coated inner liner optional)"
      ],
    },
    {
      id: "basin-box",
      title: "Wash Basin Box Set",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}basin_packaging.png`,
      shortDesc:
        "Protective packaging solutions for counter-top, pedestal, and wall-hung wash basins.",
      longDesc:
        "Wash basins have delicate curves and thin edges that chip easily. Our Wash Basin boxes incorporate specialized custom-molded interior spacers and honeycomb padding that suspend the basin within the box, absorbing transit shocks. Hand-holes on both sides ensure safe manual loading and unloading.",
      specs: [
        "Board Grade: 5-Ply Double Wall Kraft",
        "Flute Profile: B + C Flute",
        "Load Capacity: Up to 35 kg",
        "Stacking Limit: Stacking up to 8 units",
        "Cushioning: Corrugated edge-guards & honeycomb spacer rings",
        "Moisture Resistance: Medium-High"
      ],
    },
    {
      id: "urinal-box",
      title: "Urinal Carton Box",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}basin_packaging.png`,
      shortDesc:
        "Die-cut custom containers for flat-back and corner urinal bowls.",
      longDesc:
        "Urinal bowls have irregular geometries that make packing difficult. Our custom die-cut boxes are tailored specifically to the urinal profile. Cardboard support blocks fit around the mounting ears and water inlet points, locking the product securely in place and preventing shifting during transit.",
      specs: [
        "Board Grade: 5-Ply Corrugated",
        "Flute Profile: B + C Flute",
        "Load Capacity: Up to 20 kg",
        "Stacking Limit: Stacking up to 6 units",
        "Cushioning: Die-cut interlocking spacer templates",
        "Moisture Resistance: Medium-High"
      ],
    },
    {
      id: "pedestal-box",
      title: "Premium Pedestal Box Set",
      category: "sanitaryware",
      image: `${import.meta.env.BASE_URL || "/"}wc_packaging.png`,
      shortDesc:
        "Dual-compartment boxes engineered for pedestal columns and sink fittings.",
      longDesc:
        "Pedestals require structural packaging that holds columns vertical. This dual-compartment box set features reinforced corner posts that protect from lateral crushing. Separate cardboard channels keep the pedestal base and basin connection points protected from scuffing against each other.",
      specs: [
        "Board Grade: 7-Ply Heavy Duty",
        "Flute Profile: A + B Flute",
        "Load Capacity: Up to 50 kg",
        "Stacking Limit: Stacking up to 8 units",
        "Cushioning: Corner post protectors & vertical dividers",
        "Moisture Resistance: High"
      ],
    },
    {
      id: "fruit-box",
      title: "Ventilated Fruit Box",
      category: "other",
      image: `${import.meta.env.BASE_URL || "/"}fruit_box.png`,
      shortDesc:
        "Specially ventilated, high-strength corrugated boxes for fresh farm produce transportation.",
      longDesc:
        "Our Fruit Packaging boxes are designed to preserve freshness and sustain high humidity in cold storage units. They feature custom-placed ventilation holes to allow air circulation and die-cut hand-grips for easy manual handling. Constructed using food-safe kraft paper and moisture-resistant gluing, these boxes maintain structural integrity during stacked transport.",
      specs: [
        "Board Grade: 5-Ply Premium Virgin Kraft",
        "Flute Profile: B + E Flute Combination",
        "Load Capacity: Up to 15 kg",
        "Stacking Limit: Stacking up to 10 units",
        "Cushioning: Integrated side buffers and partition slots",
        "Moisture Resistance: Very High (Water-repellent barrier)"
      ],
    },
    {
      id: "carton-box",
      title: "Universal Carton Box",
      category: "other",
      image: `${import.meta.env.BASE_URL || "/"}carton_box.png`,
      shortDesc:
        "Standard high-utility shipping cartons designed for safe storage and heavy-duty logistics.",
      longDesc:
        "Universal Carton boxes (RSC design) are the backbone of secure shipping. Made from high-bursting-strength corrugated boards, they protect heavy or bulky products. Perfect for storage, e-commerce, and industrial shipping. These boxes can be customized with client logos, tape guides, and special folding flaps for quick assembly.",
      specs: [
        "Board Grade: 5-Ply or 7-Ply Industrial Kraft",
        "Flute Profile: A + B Flute",
        "Load Capacity: Up to 45 kg",
        "Stacking Limit: Stacking up to 8 units",
        "Cushioning: Standard corrugated cushion flaps",
        "Moisture Resistance: Medium-High"
      ],
    },
    {
      id: "export-box",
      title: "Heavy-Duty Custom Export Shipper",
      category: "other",
      image: `${import.meta.env.BASE_URL || "/"}export_box.png`,
      shortDesc:
        "Multi-wall custom-engineered shipping container for international freight and maximum cargo protection.",
      longDesc:
        "Our flagship custom export boxes are built to withstand the rigors of ocean and air freight. Constructed with reinforced 7-ply double-wall kraft and heavy fluting, they provide extreme puncture resistance. Inside, custom corner-posts and honeycomb cushioning block shifting and absorb sudden shocks, keeping valuable goods safe.",
      specs: [
        "Board Grade: 7-Ply Super-Heavy Duty Kraft",
        "Flute Profile: A + B + C Flute Combination",
        "Load Capacity: Up to 120 kg",
        "Stacking Limit: Stacking up to 15 units",
        "Cushioning: High-density honeycomb spacer blocks",
        "Moisture Resistance: High (Wax-coated or laminate lined)"
      ],
    },
  ];

  const emptyForm = {
    title: "",
    category: "sanitaryware",
    imageType: "custom",
    imagePreset: "",
    imageCustom: "",
    imageUpload: "",
    shortDesc: "",
    longDesc: "",
    specs: [],
  };

  const [productForm, setProductForm] = useState(emptyForm);
  const [productErrors, setProductErrors] = useState({});

  const handleAddProductClick = () => {
    setProductForm(emptyForm);
    setProductErrors({});
    setIsAddingNew(true);
    setEditingProduct(null);
  };

  const handleEditProductClick = (prod) => {
    const isBase64 = prod.image && prod.image.startsWith("data:image/");

    let specsList = [];
    if (Array.isArray(prod.specs)) {
      specsList = prod.specs;
    } else if (prod.specs && typeof prod.specs === "object") {
      specsList = [
        prod.specs.boardGrade && `Board Grade: ${prod.specs.boardGrade}`,
        prod.specs.fluteProfile && `Flute Profile: ${prod.specs.fluteProfile}`,
        prod.specs.loadCapacity && `Load Capacity: ${prod.specs.loadCapacity}`,
        prod.specs.stackingLimit && `Stacking Limit: ${prod.specs.stackingLimit}`,
        prod.specs.cushioning && `Cushioning: ${prod.specs.cushioning}`,
        prod.specs.moistureResistance && `Moisture Resistance: ${prod.specs.moistureResistance}`,
      ].filter(Boolean);
    }

    setProductForm({
      title: prod.title,
      category: prod.category,
      imageType: "custom",
      imagePreset: "",
      imageCustom: isBase64 ? "" : prod.image,
      imageUpload: isBase64 ? prod.image : "",
      shortDesc: prod.shortDesc,
      longDesc: prod.longDesc,
      specs: specsList,
    });
    setProductErrors({});
    setIsAddingNew(false);
    setEditingProduct(prod);
  };

  const handleMoveProduct = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === productsList.length - 1) return;

    const originalList = [...productsList];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedList = [...productsList];
    
    // Swap the products
    const temp = updatedList[index];
    updatedList[index] = updatedList[newIndex];
    updatedList[newIndex] = temp;

    // Update state locally for instant feedback
    setProductsList(updatedList);

    // Call API to save the new sequence
    const sequenceIds = updatedList.map(p => p.id);
    fetch(`${API_BASE_URL}/products.php`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify({ sequence: sequenceIds }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save product sequence");
        return res.json();
      })
      .catch((err) => {
        console.error("Error saving product sequence:", err);
        alert("Failed to save the new order. Reverting changes.");
        setProductsList(originalList);
      });
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
    setProductErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while scaling down to max boundaries
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG at 75% quality to reduce base64 size drastically
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);

        setProductForm((prev) => ({
          ...prev,
          imageUpload: compressedBase64,
          imageCustom: "",
        }));
        setProductErrors((prev) => ({
          ...prev,
          imageCustom: "",
          imageUpload: "",
        }));
      };
    };
    reader.readAsDataURL(file);
  };

  const validateProductForm = () => {
    const errors = {};
    if (!productForm.title.trim()) errors.title = "Title is required";
    if (!productForm.imageUpload && !productForm.imageCustom.trim()) {
      errors.imageCustom =
        "Please upload an image file or enter a custom URL/path";
    }

    setProductErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (isSavingProduct) return;
    if (!validateProductForm()) return;

    setIsSavingProduct(true);
    const imagePath = productForm.imageUpload || productForm.imageCustom;

    const savedSpecs = Array.isArray(productForm.specs)
      ? productForm.specs.map((s) => s.trim()).filter(Boolean)
      : [];

    const targetProduct = {
      id: isAddingNew
        ? productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
          "-" +
          Date.now()
        : editingProduct.id,
      title: productForm.title,
      category: productForm.category,
      image: imagePath,
      shortDesc:
        productForm.shortDesc.trim() ||
        "High-quality custom corrugated box solution.",
      longDesc:
        productForm.longDesc.trim() ||
        "Custom designed packaging solution constructed to provide optimal durability and protection for transit.",
      specs: savedSpecs,
      sort_order: isAddingNew ? productsList.length : (editingProduct.sort_order ?? 0),
    };

    fetch(`${API_BASE_URL}/products.php`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(targetProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save product on backend");
        return res.json();
      })
      .then(() => {
        let updatedList = [];
        if (isAddingNew) {
          updatedList = [...productsList, targetProduct];
        } else {
          updatedList = productsList.map((p) =>
            p.id === editingProduct.id ? targetProduct : p,
          );
        }
        setProductsList(updatedList);
        setEditingProduct(null);
        setIsAddingNew(false);
        setIsSavingProduct(false);
      })
      .catch((err) => {
        console.error("Error saving product:", err);
        alert("Failed to save product. Please check your connection.");
        setIsSavingProduct(false);
      });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${API_BASE_URL}/products.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders(true),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete product");
          return res.json();
        })
        .then(() => {
          const updatedList = productsList.filter((p) => p.id !== id);
          setProductsList(updatedList);
        })
        .catch((err) => {
          console.error("Error deleting product:", err);
          alert("Failed to delete product from the server.");
        });
    }
  };

  const handleSeedDatabase = () => {
    if (
      window.confirm(
        "Initialize the database with the 7 default packaging products?",
      )
    ) {
      setIsLoading(true);

      const seedPromises = defaults.map((prod) => {
        return fetch(`${API_BASE_URL}/products.php`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify(prod),
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to save product: " + prod.title);
          return res.json();
        });
      });

      Promise.all(seedPromises)
        .then(() => {
          alert("Database seeded successfully!");
          return fetch(`${API_BASE_URL}/products.php`);
        })
        .then((res) => res.json())
        .then((data) => setProductsList(data))
        .catch((err) => {
          console.error("Error seeding database:", err);
          alert("Seeding failed: " + err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  /* Handle window resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Login State */
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const loadInitialData = (authToken) => {
    // Set temp credentials in config session-memory for requests in progress
    sessionStorage.setItem("admin_auth", authToken);

    // 1. Fetch products
    fetch(`${API_BASE_URL}/products.php`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProductsList(data);
      })
      .catch((err) => {
        console.error("Failed to load products from API:", err);
      });

    // 2. Fetch messages (requires auth token)
    fetch(`${API_BASE_URL}/inquiries.php`, {
      headers: { Authorization: authToken },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMessages(sorted);
      })
      .catch((err) => {
        console.error("Failed to load messages from API:", err);
      });
  };

  useEffect(() => {
    const auth =
      sessionStorage.getItem("admin_auth") ||
      localStorage.getItem("admin_auth_persistent");
    if (auth) {
      // Validate token by fetching inquiries
      fetch(`${API_BASE_URL}/inquiries.php`, {
        headers: { Authorization: auth },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true);
            loadInitialData(auth);
          } else {
            sessionStorage.removeItem("admin_auth");
            localStorage.removeItem("admin_auth_persistent");
          }
          setIsAuthChecking(false);
        })
        .catch(() => {
          setIsAuthChecking(false);
        });
    } else {
      setIsAuthChecking(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    fetch(`${API_BASE_URL}/inquiries.php`, {
      headers: { Authorization: password },
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          if (keepLoggedIn) {
            localStorage.setItem("admin_auth_persistent", password);
          } else {
            sessionStorage.setItem("admin_auth", password);
          }
          loadInitialData(password);
        } else if (res.status === 401) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Server returned error: " + res.status);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Network error: Cannot reach the backend API.");
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_auth_persistent");
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const loadMessages = () => {
    fetch(`${API_BASE_URL}/inquiries.php`, {
      headers: getHeaders(true),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMessages(sorted);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });
  };

  const deleteMessage = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      fetch(`${API_BASE_URL}/inquiries.php?id=${id}`, {
        method: "DELETE",
        headers: getHeaders(true),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete message");
          return res.json();
        })
        .then(() => {
          const updatedMessages = messages.filter((msg) => msg.id !== id);
          setMessages(updatedMessages);
          if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage(null);
          }
        })
        .catch((err) => {
          console.error("Error deleting message:", err);
          alert("Failed to delete message from server.");
        });
    }
  };

  const viewMessage = (msg) => {
    if (msg.status === "unread") {
      fetch(`${API_BASE_URL}/inquiries.php`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ id: msg.id, status: "read" }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to mark message read");
          return res.json();
        })
        .then(() => {
          const updatedMessages = messages.map((m) =>
            m.id === msg.id ? { ...m, status: "read" } : m,
          );
          setMessages(updatedMessages);
          setSelectedMessage({ ...msg, status: "read" });
        })
        .catch((err) => {
          console.error("Error view message:", err);
          setSelectedMessage(msg);
        });
    } else {
      setSelectedMessage(msg);
    }
  };

  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => m.status === "unread").length;
  const todayMessages = messages.filter((m) => {
    const today = new Date().toDateString();
    return new Date(m.date).toDateString() === today;
  }).length;
  const totalQuotes = messages.filter(
    (m) => m.message && m.message.includes("Product Quote Request:"),
  ).length;
  const generalInquiries = totalMessages - totalQuotes;

  if (isAuthChecking) {
    return (
      <div className="auth-loading">
        <div className="spinner-large"></div>
        <p>Verifying Access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-header">
            <img
              src={`${import.meta.env.BASE_URL || "/"}logo.jpg`}
              alt="Shukan Packaging Logo"
              className="login-brand-logo"
            />
            <h1>Admin Portal</h1>
            <p>Please authenticate to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-msg">⚠️ {error}</div>}

            <div className="form-group">
              <label className="login-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="login-input"
                  placeholder="Enter your secure password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <span>Keep me logged in</span>
              </label>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="loading-spinner-sm"></div>
                  Authenticating...
                </>
              ) : (
                <>Login to Dashboard ➔</>
              )}
            </button>

            <a href="/" className="back-link">
              ← Return to Website
            </a>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen && window.innerWidth <= 768 ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>
            <span style={{ color: "var(--accent-color)" }}>Admin</span>Panel
          </h2>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`menu-item ${view === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setView("dashboard");
              if (window.innerWidth <= 768) setSidebarOpen(false);
            }}
          >
            <span>📊</span> Dashboard
          </li>
          <li
            className={`menu-item ${view === "messages" ? "active" : ""}`}
            onClick={() => {
              setView("messages");
              if (window.innerWidth <= 768) setSidebarOpen(false);
            }}
          >
            <span>📬</span> Messages
            {unreadMessages > 0 && (
              <span className="unread-badge">{unreadMessages}</span>
            )}
          </li>
          <li
            className={`menu-item ${view === "products" ? "active" : ""}`}
            onClick={() => {
              setView("products");
              setIsAddingNew(false);
              setEditingProduct(null);
              if (window.innerWidth <= 768) setSidebarOpen(false);
            }}
          >
            <span>📦</span> Manage Products
          </li>
          <li
            className="menu-item"
            onClick={() => alert("Settings feature coming soon!")}
          >
            <span>⚙️</span> Settings
          </li>
        </ul>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* Mobile Header with Toggle */}
        <div className="mobile-header">
          <div className="mobile-header-left">
            <button className="menu-toggle-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <h2>{view === "dashboard" ? "Overview" : view === "products" ? "Manage Products" : "Messages"}</h2>
          </div>
          <div className="profile-icon">👤</div>
        </div>

        <div className="desktop-header-control">
          <h1>{view === "dashboard" ? "Overview" : view === "products" ? "Manage Products" : "Messages"}</h1>
          <div className="admin-profile-desktop">
            <span>Welcome back, Admin</span>
            <div className="profile-icon">👤</div>
          </div>
        </div>

        {view === "dashboard" && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div
                className="stat-card"
                onClick={() => {
                  setFilterType("all");
                  setFilterStatus("all");
                  setFilterDate("all");
                  setView("messages");
                }}
              >
                <div className="stat-icon blue">📬</div>
                <div className="stat-info">
                  <h3>{totalMessages}</h3>
                  <p>Total Inquiries</p>
                </div>
              </div>
              <div
                className="stat-card"
                onClick={() => {
                  setFilterType("quote");
                  setFilterStatus("all");
                  setFilterDate("all");
                  setShowFilterBar(true);
                  setView("messages");
                }}
              >
                <div className="stat-icon orange">📦</div>
                <div className="stat-info">
                  <h3>{totalQuotes}</h3>
                  <p>Product Quotes</p>
                </div>
              </div>
              <div
                className="stat-card"
                onClick={() => {
                  setFilterType("query");
                  setFilterStatus("all");
                  setFilterDate("all");
                  setShowFilterBar(true);
                  setView("messages");
                }}
              >
                <div className="stat-icon teal">💬</div>
                <div className="stat-info">
                  <h3>{generalInquiries}</h3>
                  <p>General Queries</p>
                </div>
              </div>
              <div
                className="stat-card"
                onClick={() => {
                  setFilterType("all");
                  setFilterStatus("unread");
                  setFilterDate("all");
                  setShowFilterBar(true);
                  setView("messages");
                }}
              >
                <div className="stat-icon purple">🆕</div>
                <div className="stat-info">
                  <h3>{unreadMessages}</h3>
                  <p>Unread Messages</p>
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="data-card">
              <div className="card-header">
                <h3 className="card-title">Recent Inquiries</h3>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  onClick={() => setView("messages")}
                >
                  View All
                </button>
              </div>
              <div className="responsive-table">
                <table className="messages-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 5).map((msg) => {
                      const isQuote =
                        msg.message &&
                        msg.message.includes("Product Quote Request:");
                      return (
                        <tr
                          key={msg.id}
                          className="inquiry-row"
                          onClick={() => viewMessage(msg)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="cell-type">
                            <span
                              className={`type-badge ${isQuote ? "quote" : "contact"}`}
                            >
                              {isQuote ? "📦 Quote" : "💬 Query"}
                            </span>
                          </td>
                          <td className="cell-status">
                            <span
                              className={`status-badge ${msg.status === "unread" ? "unread" : "read"}`}
                            >
                              {msg.status === "unread" ? "New" : "Read"}
                            </span>
                          </td>
                          <td className="cell-name">
                            <strong>{msg.name}</strong>
                          </td>
                          <td className="cell-email">{msg.email}</td>
                          <td className="cell-date">{new Date(msg.date).toLocaleDateString()}</td>
                          <td className="cell-action">
                            <div className="action-buttons">
                              <button
                                className="action-btn btn-view"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewMessage(msg);
                                }}
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {messages.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#94a3b8",
                          }}
                        >
                          No messages found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {view === "messages" && (
          <div className="data-card">
            <div className="card-header">
              <h3 className="card-title">All Messages</h3>
              <div className="header-actions">
                <button
                  onClick={() => {
                    const filteredMessages = messages.filter((msg) => {
                      const matchesSearch =
                        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        msg.email.toLowerCase().includes(searchTerm.toLowerCase());
                      if (!matchesSearch) return false;

                      const isQuote = msg.message && msg.message.includes("Product Quote Request:");
                      if (filterType === "quote" && !isQuote) return false;
                      if (filterType === "query" && isQuote) return false;

                      if (filterStatus !== "all" && msg.status !== filterStatus) return false;

                      if (filterDate !== "all") {
                        const msgDate = new Date(msg.date);
                        const now = new Date();
                        if (filterDate === "today") {
                          if (msgDate.toDateString() !== now.toDateString()) return false;
                        } else if (filterDate === "week") {
                          const oneWeekAgo = new Date();
                          oneWeekAgo.setDate(now.getDate() - 7);
                          if (msgDate < oneWeekAgo) return false;
                        } else if (filterDate === "month") {
                          const oneMonthAgo = new Date();
                          oneMonthAgo.setMonth(now.getMonth() - 1);
                          if (msgDate < oneMonthAgo) return false;
                        }
                      }
                      return true;
                    });

                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      "Date,Type,Name,Email,Message,Status\n" +
                      filteredMessages
                        .map((e) => {
                          const type =
                            e.message &&
                            e.message.includes("Product Quote Request:")
                              ? "Quote Request"
                              : "General Inquiry";
                          return `${e.date},${type},${e.name},${e.email},"${e.message.replace(/"/g, '""')}",${e.status}`;
                        })
                        .join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "contact_messages.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="export-btn"
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={() => setShowFilterBar(!showFilterBar)}
                  className={`filter-toggle-btn ${showFilterBar || filterType !== "all" || filterStatus !== "all" || filterDate !== "all" ? "active" : ""}`}
                >
                  🔍 Filter{(filterType !== "all" || filterStatus !== "all" || filterDate !== "all") && " (Active)"}
                </button>
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            {showFilterBar && (
              <div className="filter-panel">
                <div className="filter-group">
                  <label>Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Types</option>
                    <option value="quote">Quote Requests</option>
                    <option value="query">General Inquiries</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="unread">New (Unread)</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Date Range</label>
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
                {(filterType !== "all" || filterStatus !== "all" || filterDate !== "all") && (
                  <button
                    onClick={() => {
                      setFilterType("all");
                      setFilterStatus("all");
                      setFilterDate("all");
                    }}
                    className="clear-filters-btn"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
            <div className="responsive-table">
              <table className="messages-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = messages.filter((msg) => {
                      const matchesSearch =
                        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        msg.email.toLowerCase().includes(searchTerm.toLowerCase());
                      if (!matchesSearch) return false;

                      const isQuote = msg.message && msg.message.includes("Product Quote Request:");
                      if (filterType === "quote" && !isQuote) return false;
                      if (filterType === "query" && isQuote) return false;

                      if (filterStatus !== "all" && msg.status !== filterStatus) return false;

                      if (filterDate !== "all") {
                        const msgDate = new Date(msg.date);
                        const now = new Date();
                        if (filterDate === "today") {
                          if (msgDate.toDateString() !== now.toDateString()) return false;
                        } else if (filterDate === "week") {
                          const oneWeekAgo = new Date();
                          oneWeekAgo.setDate(now.getDate() - 7);
                          if (msgDate < oneWeekAgo) return false;
                        } else if (filterDate === "month") {
                          const oneMonthAgo = new Date();
                          oneMonthAgo.setMonth(now.getMonth() - 1);
                          if (msgDate < oneMonthAgo) return false;
                        }
                      }
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              padding: "40px",
                              color: "#94a3b8",
                            }}
                          >
                            No matching messages found.
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((msg) => {
                      const isQuote =
                        msg.message &&
                        msg.message.includes("Product Quote Request:");
                      return (
                        <tr
                          key={msg.id}
                          className="inquiry-row"
                          onClick={() => viewMessage(msg)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="cell-type">
                            <span
                              className={`type-badge ${isQuote ? "quote" : "contact"}`}
                            >
                              {isQuote ? "📦 Quote" : "💬 Query"}
                            </span>
                          </td>
                          <td className="cell-status">
                            <span
                              className={`status-badge ${msg.status === "unread" ? "unread" : "read"}`}
                            >
                              {msg.status === "unread" ? "New" : "Read"}
                            </span>
                          </td>
                          <td className="cell-name">
                            <strong>{msg.name}</strong>
                          </td>
                          <td className="cell-email">{msg.email}</td>
                          <td className="cell-date">{new Date(msg.date).toLocaleString()}</td>
                          <td className="cell-action">
                            <div className="action-buttons">
                              <button
                                className="action-btn btn-view"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewMessage(msg);
                                }}
                              >
                                View
                              </button>
                              <button
                                className="action-btn btn-delete"
                                onClick={(e) => deleteMessage(msg.id, e)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === "products" && (
          <div className="data-card">
            <div className="card-header">
              <h3 className="card-title">Manage Products</h3>
              {!editingProduct && !isAddingNew && (
                <button
                  onClick={handleAddProductClick}
                  className="export-btn"
                  style={{ background: "var(--primary-color)" }}
                >
                  ➕ Add New Product
                </button>
              )}
            </div>

            {!editingProduct && !isAddingNew ? (
              <div className="responsive-table">
                <table className="messages-table">
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((prod, index) => {
                      const isExpanded = expandedProductId === prod.id;
                      return (
                        <Fragment key={prod.id}>
                          <tr
                            className={`product-row ${isExpanded ? "expanded" : ""}`}
                            onClick={() => setExpandedProductId(isExpanded ? null : prod.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <td className="cell-thumb">
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="admin-product-thumb"
                              />
                            </td>
                            <td className="cell-title">
                              <strong>{prod.title}</strong>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  display: "block",
                                  marginTop: "4px",
                                  fontWeight: "500",
                                }}
                              >
                                {isExpanded ? "Hide specifications ▴" : "Click row to view specs ▾"}
                              </span>
                            </td>
                            <td className="cell-cat">
                              <span className={`category-badge ${prod.category}`}>
                                {prod.category === "sanitaryware"
                                  ? "Sanitaryware"
                                  : "Other & Retail"}
                              </span>
                            </td>
                            <td className="cell-action" onClick={(e) => e.stopPropagation()}>
                              <div className="action-buttons">
                                <button
                                  className="seq-btn"
                                  onClick={() => handleMoveProduct(index, "up")}
                                  disabled={index === 0}
                                >
                                  ▲
                                </button>
                                <button
                                  className="seq-btn"
                                  onClick={() => handleMoveProduct(index, "down")}
                                  disabled={index === productsList.length - 1}
                                >
                                  ▼
                                </button>
                                <button
                                  className="action-btn btn-view"
                                  onClick={() => handleEditProductClick(prod)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="action-btn btn-delete"
                                  onClick={() => handleDeleteProduct(prod.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="product-specs-expansion-row">
                              <td colSpan="4">
                                <div
                                  style={{
                                    fontWeight: "700",
                                    color: "var(--primary-color)",
                                    marginBottom: "10px",
                                    fontSize: "13px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Technical Specifications:
                                </div>
                                {(() => {
                                  let specsList = [];
                                  if (Array.isArray(prod.specs)) {
                                    specsList = prod.specs;
                                  } else if (prod.specs && typeof prod.specs === "object") {
                                    specsList = [
                                      prod.specs.boardGrade && `Board Grade: ${prod.specs.boardGrade}`,
                                      prod.specs.fluteProfile && `Flute Profile: ${prod.specs.fluteProfile}`,
                                      prod.specs.loadCapacity && `Load Capacity: ${prod.specs.loadCapacity}`,
                                      prod.specs.stackingLimit && `Stacking Limit: ${prod.specs.stackingLimit}`,
                                      prod.specs.cushioning && `Cushioning: ${prod.specs.cushioning}`,
                                      prod.specs.moistureResistance && `Moisture Resistance: ${prod.specs.moistureResistance}`,
                                    ].filter(Boolean);
                                  }

                                  return specsList.length > 0 ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        paddingLeft: "4px",
                                      }}
                                    >
                                      {specsList.map((spec, sIdx) => {
                                        const colonIdx = spec.indexOf(":");
                                        let label = "";
                                        let val = spec;
                                        if (colonIdx !== -1) {
                                          label = spec.substring(0, colonIdx).trim();
                                          val = spec.substring(colonIdx + 1).trim();
                                        }

                                        return (
                                          <div
                                            key={sIdx}
                                            style={{
                                              fontSize: "13px",
                                              color: "#475569",
                                              display: "flex",
                                              gap: "8px",
                                              alignItems: "flex-start",
                                            }}
                                          >
                                            <span
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "20px",
                                                height: "20px",
                                                background: "rgba(0, 118, 168, 0.1)",
                                                color: "var(--secondary-color)",
                                                borderRadius: "50%",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                flexShrink: 0,
                                                marginTop: "1px",
                                              }}
                                            >
                                              {sIdx + 1}
                                            </span>
                                            <span style={{ lineHeight: "20px" }}>
                                              {label ? (
                                                <>
                                                  <strong style={{ color: "var(--primary-color)" }}>
                                                    {label}:
                                                  </strong>{" "}
                                                  {val}
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
                                    <span
                                      style={{
                                        color: "#94a3b8",
                                        fontStyle: "italic",
                                        fontSize: "13px",
                                      }}
                                    >
                                      No specifications defined.
                                    </span>
                                  );
                                })()}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                    {productsList.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#94a3b8",
                          }}
                        >
                          No products found. Click "Add New Product" to create
                          one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <form
                onSubmit={handleProductSubmit}
                className="admin-product-form"
              >
                <h2
                  style={{
                    margin: "0 0 24px 0",
                    fontSize: "20px",
                    color: "var(--primary-color)",
                  }}
                >
                  {isAddingNew
                    ? "Add New Product"
                    : `Edit Product: ${editingProduct?.title}`}
                </h2>

                <div className="product-form-grid">
                  <div className="form-group-inquiry">
                    <label>Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={productForm.title}
                      onChange={handleProductInputChange}
                      className={productErrors.title ? "error-border" : ""}
                    />
                    {productErrors.title && (
                      <span className="error-text-small">
                        {productErrors.title}
                      </span>
                    )}
                  </div>

                  <div className="form-group-inquiry">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductInputChange}
                      className="login-input"
                    >
                      <option value="sanitaryware">
                        Sanitaryware Packaging
                      </option>
                      <option value="other">Other & Retail Packaging</option>
                    </select>
                  </div>

                  <div
                    className="form-group-inquiry full-width"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label
                      style={{
                        fontWeight: "600",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Product Image *
                    </label>
                    <div className="custom-image-setup-box">
                      {/* Left Side: Upload Direct Image File */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#64748b",
                          }}
                        >
                          Upload Direct Image File
                        </span>
                        <div
                          className={`upload-dropzone ${productErrors.imageCustom ? "error" : ""}`}
                          onClick={() =>
                            document
                              .getElementById("custom-image-file-input")
                              .click()
                          }
                        >
                          <input
                            id="custom-image-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageUpload(e);
                            }}
                            style={{ display: "none" }}
                          />
                          {productForm.imageUpload ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <img
                                src={productForm.imageUpload}
                                alt="Upload Preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "80px",
                                  objectFit: "contain",
                                  borderRadius: "4px",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#10b981",
                                  fontWeight: "500",
                                }}
                              >
                                ✓ Uploaded successfully (Click to change)
                              </span>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span style={{ fontSize: "24px" }}>📁</span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#64748b",
                                  fontWeight: "500",
                                }}
                              >
                                Choose a local image file
                              </span>
                              <span
                                style={{ fontSize: "11px", color: "#94a3b8" }}
                              >
                                PNG, JPG, WEBP (Max 1.5MB)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Custom Image URL */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#64748b",
                          }}
                        >
                          Or Enter Image URL / Path
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <input
                            type="text"
                            name="imageCustom"
                            value={productForm.imageCustom}
                            placeholder="e.g. /custom_box.png or https://example.com/box.jpg"
                            onChange={(e) => {
                              handleProductInputChange(e);
                              // clear the uploaded file if they type a URL, to keep it clean
                              setProductForm((prev) => ({
                                ...prev,
                                imageUpload: "",
                              }));
                            }}
                            className={`form-image-url-input ${productErrors.imageCustom ? "error-border" : ""}`}
                          />
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#94a3b8",
                              lineHeight: "1.4",
                            }}
                          >
                            If you enter a URL here, it will override the
                            uploaded file. Leave blank to use the uploaded file.
                          </span>
                        </div>
                      </div>
                    </div>
                    {productErrors.imageCustom && (
                      <span
                        className="error-text-small"
                        style={{ marginTop: "8px", display: "block" }}
                      >
                        {productErrors.imageCustom}
                      </span>
                    )}
                  </div>

                  <div
                    className="form-group-inquiry full-width"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label>Short Description</label>
                    <textarea
                      name="shortDesc"
                      value={productForm.shortDesc}
                      onChange={handleProductInputChange}
                    />
                  </div>

                  <div
                    className="form-group-inquiry full-width"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label>Long Description</label>
                    <textarea
                      name="longDesc"
                      value={productForm.longDesc}
                      onChange={handleProductInputChange}
                    />
                  </div>

                  <div className="form-specs-section-header">
                    <h3>Technical Specifications</h3>
                  </div>

                  <div className="full-width" style={{ gridColumn: "1 / -1" }}>
                    <div className="form-specs-header">
                      <span className="form-specs-title">
                        List of Specifications (e.g. "Board Grade: 5-Ply Kraft")
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setProductForm(prev => ({
                            ...prev,
                            specs: [...(Array.isArray(prev.specs) ? prev.specs : []), ""]
                          }));
                        }}
                        className="form-specs-add-btn"
                      >
                        ➕ Add Row
                      </button>
                    </div>

                    <div className="form-specs-list">
                      {(Array.isArray(productForm.specs) ? productForm.specs : []).map((spec, index) => (
                        <div key={index} className="form-spec-item">
                          <span className="form-spec-num">
                            {index + 1}.
                          </span>
                          <input
                            type="text"
                            value={spec}
                            placeholder={`e.g. ${index === 0 ? "Board Grade: 5-Ply Kraft" : index === 1 ? "Flute Profile: B + C Flute" : "Specification details"}`}
                            onChange={(e) => {
                              const newSpecs = [...productForm.specs];
                              newSpecs[index] = e.target.value;
                              setProductForm(prev => ({ ...prev, specs: newSpecs }));
                            }}
                            className="form-spec-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = productForm.specs.filter((_, idx) => idx !== index);
                              setProductForm(prev => ({ ...prev, specs: newSpecs }));
                            }}
                            className="form-spec-remove-btn"
                            title="Remove Specification"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(Array.isArray(productForm.specs) ? productForm.specs : []).length === 0 && (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '30px 20px', 
                          color: '#94a3b8', 
                          border: '2px dashed #cbd5e1', 
                          borderRadius: '12px',
                          fontSize: '14px',
                          background: 'rgba(255, 255, 255, 0.3)'
                        }}>
                          No specifications added yet. Click "➕ Add Row" to define specifications.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-submit-row">
                  <button
                    type="button"
                    className="form-btn cancel-btn"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="form-btn save-btn"
                    disabled={isSavingProduct}
                  >
                    {isSavingProduct ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedMessage(null)}
            >
              &times;
            </button>

            <div className="message-detail-header">
              <h2 style={{ margin: 0, fontSize: "24px" }}>
                {selectedMessage.name}
              </h2>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                Sent on {new Date(selectedMessage.date).toLocaleString()}
              </span>
            </div>

            <div className="message-meta">
              <div className="meta-item">
                <label>EMAIL ADDRESS</label>
                <p>{selectedMessage.email}</p>
              </div>
              <div className="meta-item">
                <label>STATUS</label>
                <p style={{ textTransform: "capitalize" }}>
                  {selectedMessage.status}
                </p>
              </div>
            </div>

            <div className="meta-item" style={{ marginBottom: "8px" }}>
              <label>MESSAGE CONTENT</label>
            </div>
            <div className="message-body" style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "4px"
            }}>
              {(() => {
                const parsed = parseInquiryMessage(selectedMessage.message);
                if (parsed) {
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {parsed.map((field, index) => (
                        <div key={index} className="parsed-field-row" style={{
                          borderBottom: index === parsed.length - 1 ? "none" : "1px solid #e2e8f0",
                          paddingBottom: index === parsed.length - 1 ? "0" : "12px"
                        }}>
                          <span style={{
                            display: "block",
                            color: "var(--primary-color)",
                            fontSize: "12px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "4px"
                          }}>
                            {field.label}
                          </span>
                          <span style={{
                            color: "#1e293b",
                            fontSize: "14.5px",
                            fontWeight: "500",
                            lineHeight: "1.5",
                            display: "block",
                            whiteSpace: "pre-wrap"
                          }}>
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <div style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "14.5px",
                    color: "#334155",
                    lineHeight: "1.6"
                  }}>
                    {selectedMessage.message}
                  </div>
                );
              })()}
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setSelectedMessage(null)}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Close
              </button>
              <button
                onClick={(e) => deleteMessage(selectedMessage.id, e)}
                style={{
                  padding: "10px 20px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
