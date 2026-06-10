import { useState, useEffect } from "react";
import "../styles/pages.css"; // Base styles
import "../styles/admin.css"; // Admin specific styles
import { useNavigate } from "react-router-dom";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'messages' | 'settings' | 'products'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const getStoredProducts = () => {
    const saved = localStorage.getItem("shukan_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaults = [
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
    localStorage.setItem("shukan_products", JSON.stringify(defaults));
    return defaults;
  };

  const emptyForm = {
    title: "",
    category: "sanitaryware",
    imageType: "custom",
    imagePreset: "",
    imageCustom: "",
    imageUpload: "",
    shortDesc: "",
    longDesc: "",
    specs: {
      boardGrade: "",
      fluteProfile: "",
      loadCapacity: "",
      stackingLimit: "",
      cushioning: "",
      moistureResistance: "",
    }
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

    setProductForm({
      title: prod.title,
      category: prod.category,
      imageType: "custom",
      imagePreset: "",
      imageCustom: isBase64 ? "" : prod.image,
      imageUpload: isBase64 ? prod.image : "",
      shortDesc: prod.shortDesc,
      longDesc: prod.longDesc,
      specs: {
        boardGrade: prod.specs?.boardGrade || "",
        fluteProfile: prod.specs?.fluteProfile || "",
        loadCapacity: prod.specs?.loadCapacity || "",
        stackingLimit: prod.specs?.stackingLimit || "",
        cushioning: prod.specs?.cushioning || "",
        moistureResistance: prod.specs?.moistureResistance || "",
      }
    });
    setProductErrors({});
    setIsAddingNew(false);
    setEditingProduct(prod);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
    setProductErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleProductSpecChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      specs: { ...prev.specs, [name]: value }
    }));
    setProductErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large. Please upload an image smaller than 1.5MB to keep local storage working.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm(prev => ({
        ...prev,
        imageUpload: reader.result,
        imageCustom: ""
      }));
      setProductErrors(prev => ({ ...prev, imageCustom: "", imageUpload: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validateProductForm = () => {
    const errors = {};
    if (!productForm.title.trim()) errors.title = "Title is required";
    if (!productForm.imageUpload && !productForm.imageCustom.trim()) {
      errors.imageCustom = "Please upload an image file or enter a custom URL/path";
    }
    
    setProductErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    const imagePath = productForm.imageUpload || productForm.imageCustom;

    const savedSpecs = {
      boardGrade: productForm.specs.boardGrade.trim() || "Standard Grade",
      fluteProfile: productForm.specs.fluteProfile.trim() || "Standard Flute",
      loadCapacity: productForm.specs.loadCapacity.trim() || "Standard Capacity",
      stackingLimit: productForm.specs.stackingLimit.trim() || "Standard",
      cushioning: productForm.specs.cushioning.trim() || "Standard corrugated buffers",
      moistureResistance: productForm.specs.moistureResistance.trim() || "Medium",
    };

    let updatedList = [];
    if (isAddingNew) {
      const newProduct = {
        id: productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
        title: productForm.title,
        category: productForm.category,
        image: imagePath,
        shortDesc: productForm.shortDesc.trim() || "High-quality custom corrugated box solution.",
        longDesc: productForm.longDesc.trim() || "Custom designed packaging solution constructed to provide optimal durability and protection for transit.",
        specs: savedSpecs
      };
      updatedList = [...productsList, newProduct];
    } else {
      updatedList = productsList.map(p => p.id === editingProduct.id ? {
        ...p,
        title: productForm.title,
        category: productForm.category,
        image: imagePath,
        shortDesc: productForm.shortDesc.trim() || "High-quality custom corrugated box solution.",
        longDesc: productForm.longDesc.trim() || "Custom designed packaging solution constructed to provide optimal durability and protection for transit.",
        specs: savedSpecs
      } : p);
    }

    localStorage.setItem("shukan_products", JSON.stringify(updatedList));
    setProductsList(updatedList);
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedList = productsList.filter(p => p.id !== id);
      localStorage.setItem("shukan_products", JSON.stringify(updatedList));
      setProductsList(updatedList);
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Login State */
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  useEffect(() => {
    // Check session or local storage based on persistence
    const auth = sessionStorage.getItem("admin_auth") || localStorage.getItem("admin_auth_persistent");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadMessages();
      setProductsList(getStoredProducts());
    }
    // Simulate a brief check for smoother UX
    setTimeout(() => setIsAuthChecking(false), 500);
  }, []);


  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
        if (password === "admin123") {
            setIsAuthenticated(true);
            if (keepLoggedIn) {
                localStorage.setItem("admin_auth_persistent", "true");
            } else {
                sessionStorage.setItem("admin_auth", "true");
            }
            loadMessages();
            setProductsList(getStoredProducts());
        } else {
            setError("Incorrect password. Please try again.");
            setIsLoading(false);
        }
    }, 800);
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
    try {
        const data = JSON.parse(localStorage.getItem("contact_messages") || "[]");
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMessages(sorted);
    } catch (e) {
        console.error("Failed to load messages", e);
        setMessages([]);
    }
  };

  const deleteMessage = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = messages.filter((msg) => msg.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem("contact_messages", JSON.stringify(updatedMessages));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const viewMessage = (msg) => {
    if (msg.status === 'unread') {
        const updatedMessages = messages.map(m => 
            m.id === msg.id ? { ...m, status: 'read' } : m
        );
        setMessages(updatedMessages);
        localStorage.setItem("contact_messages", JSON.stringify(updatedMessages));
        setSelectedMessage({ ...msg, status: 'read' });
    } else {
        setSelectedMessage(msg);
    }
  };

  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;
  const todayMessages = messages.filter(m => {
    const today = new Date().toDateString();
    return new Date(m.date).toDateString() === today;
  }).length;
  const totalQuotes = messages.filter(m => m.message && m.message.includes("Product Quote Request:")).length;
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
            {error && (
                <div className="error-msg">
                    ⚠️ {error}
                </div>
            )}

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
        className={`sidebar-overlay ${isSidebarOpen && window.innerWidth <= 768 ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
            <h2>
                <span style={{color: 'var(--accent-color)'}}>Admin</span>Panel
            </h2>
            <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        
        <ul className="sidebar-menu">
            <li 
                className={`menu-item ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setView('dashboard'); if(window.innerWidth <= 768) setSidebarOpen(false); }}
            >
                <span>📊</span> Dashboard
            </li>
            <li 
                className={`menu-item ${view === 'messages' ? 'active' : ''}`}
                onClick={() => { setView('messages'); if(window.innerWidth <= 768) setSidebarOpen(false); }}
            >
                <span>📬</span> Messages
                {unreadMessages > 0 && (
                    <span className="unread-badge">
                        {unreadMessages}
                    </span>
                )}
            </li>
            <li 
                className={`menu-item ${view === 'products' ? 'active' : ''}`}
                onClick={() => { 
                    setView('products'); 
                    setIsAddingNew(false);
                    setEditingProduct(null);
                    if(window.innerWidth <= 768) setSidebarOpen(false); 
                }}
            >
                <span>📦</span> Manage Products
            </li>
            <li className="menu-item" onClick={() => alert("Settings feature coming soon!")}>
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
              <h2>Admin Panel</h2>
           </div>
           <div className="profile-icon">👤</div>
        </div>

        <div className="desktop-header-control">
            <h1>
                {view === 'dashboard' ? 'Overview' : 'Messages'}
            </h1>
            <div className="admin-profile-desktop">
                <span>Welcome back, Admin</span>
                <div className="profile-icon">👤</div>
            </div>
        </div>

        {view === 'dashboard' && (
            <>
                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">📬</div>
                        <div className="stat-info">
                            <h3>{totalMessages}</h3>
                            <p>Total Inquiries</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">📦</div>
                        <div className="stat-info">
                            <h3>{totalQuotes}</h3>
                            <p>Product Quotes</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon teal">💬</div>
                        <div className="stat-info">
                            <h3>{generalInquiries}</h3>
                            <p>General Queries</p>
                        </div>
                    </div>
                    <div className="stat-card">
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
                            style={{background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: 600}}
                            onClick={() => setView('messages')}
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
                                    const isQuote = msg.message && msg.message.includes("Product Quote Request:");
                                    return (
                                        <tr key={msg.id} onClick={() => viewMessage(msg)} style={{cursor: 'pointer'}}>
                                            <td>
                                                <span className={`type-badge ${isQuote ? 'quote' : 'contact'}`}>
                                                    {isQuote ? '📦 Quote' : '💬 Query'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${msg.status === 'unread' ? 'unread' : 'read'}`}>
                                                    {msg.status === 'unread' ? 'New' : 'Read'}
                                                </span>
                                            </td>
                                            <td><strong>{msg.name}</strong></td>
                                            <td>{msg.email}</td>
                                            <td>{new Date(msg.date).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn btn-view" onClick={(e) => { e.stopPropagation(); viewMessage(msg); }}>View</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {messages.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
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

        {view === 'messages' && (
            <div className="data-card">
                <div className="card-header">
                    <h3 className="card-title">All Messages</h3>
                    <div className="header-actions">
                        <button 
                            onClick={() => {
                                const csvContent = "data:text/csv;charset=utf-8," 
                                    + "Date,Type,Name,Email,Message,Status\n"
                                    + messages.map(e => {
                                        const type = e.message && e.message.includes("Product Quote Request:") ? "Quote Request" : "General Inquiry";
                                        return `${e.date},${type},${e.name},${e.email},"${e.message.replace(/"/g, '""')}",${e.status}`;
                                    }).join("\n");
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
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
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
                            {messages
                                .filter(msg => 
                                    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    msg.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((msg) => {
                                    const isQuote = msg.message && msg.message.includes("Product Quote Request:");
                                    return (
                                        <tr key={msg.id} onClick={() => viewMessage(msg)} style={{cursor: 'pointer'}}>
                                            <td>
                                                <span className={`type-badge ${isQuote ? 'quote' : 'contact'}`}>
                                                    {isQuote ? '📦 Quote' : '💬 Query'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${msg.status === 'unread' ? 'unread' : 'read'}`}>
                                                    {msg.status === 'unread' ? 'New' : 'Read'}
                                                </span>
                                            </td>
                                            <td><strong>{msg.name}</strong></td>
                                            <td>{msg.email}</td>
                                            <td>{new Date(msg.date).toLocaleString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn btn-view" onClick={(e) => { e.stopPropagation(); viewMessage(msg); }}>View</button>
                                                    <button className="action-btn btn-delete" onClick={(e) => deleteMessage(msg.id, e)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {view === 'products' && (
            <div className="data-card">
                <div className="card-header">
                    <h3 className="card-title">Manage Products</h3>
                    {!editingProduct && !isAddingNew && (
                        <button 
                            onClick={handleAddProductClick}
                            className="export-btn"
                            style={{background: 'var(--primary-color)'}}
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
                                    <th>Load Capacity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsList.map((prod) => (
                                    <tr key={prod.id}>
                                        <td>
                                            <img 
                                                src={prod.image} 
                                                alt={prod.title} 
                                                className="admin-product-thumb"
                                            />
                                        </td>
                                        <td><strong>{prod.title}</strong></td>
                                        <td>
                                            <span className={`category-badge ${prod.category}`}>
                                                {prod.category === 'sanitaryware' ? 'Sanitaryware' : 'Other & Retail'}
                                            </span>
                                        </td>
                                        <td>{prod.specs?.loadCapacity || "N/A"}</td>
                                        <td>
                                            <div className="action-buttons">
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
                                ))}
                                {productsList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
                                            No products found. Click "Add New Product" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <form onSubmit={handleProductSubmit} className="admin-product-form">
                        <h2 style={{margin: '0 0 24px 0', fontSize: '20px', color: 'var(--primary-color)'}}>
                            {isAddingNew ? "Add New Product" : `Edit Product: ${editingProduct?.title}`}
                        </h2>

                        <div className="product-form-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                            <div className="form-group-inquiry">
                                <label>Product Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={productForm.title}
                                    onChange={handleProductInputChange}
                                    className={productErrors.title ? "error-border" : ""}
                                />
                                {productErrors.title && <span className="error-text-small">{productErrors.title}</span>}
                            </div>

                            <div className="form-group-inquiry">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={productForm.category}
                                    onChange={handleProductInputChange}
                                    className="login-input"
                                    style={{padding: '12px 16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '15px'}}
                                >
                                    <option value="sanitaryware">Sanitaryware Packaging</option>
                                    <option value="other">Other & Retail Packaging</option>
                                </select>
                            </div>

                            <div className="form-group-inquiry full-width" style={{gridColumn: '1 / -1'}}>
                                <label style={{fontWeight: '600', marginBottom: '8px', display: 'block'}}>Product Image *</label>
                                <div className="custom-image-setup-box">
                                    {/* Left Side: Upload Direct Image File */}
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                        <span style={{fontSize: '13px', fontWeight: '500', color: '#64748b'}}>Upload Direct Image File</span>
                                        <div 
                                            className={`upload-dropzone ${productErrors.imageCustom ? 'error' : ''}`}
                                            onClick={() => document.getElementById('custom-image-file-input').click()}
                                        >
                                            <input 
                                                id="custom-image-file-input"
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => {
                                                    handleImageUpload(e);
                                                }} 
                                                style={{display: 'none'}}
                                            />
                                            {productForm.imageUpload ? (
                                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                                                    <img 
                                                        src={productForm.imageUpload} 
                                                        alt="Upload Preview" 
                                                        style={{maxWidth: '100%', maxHeight: '80px', objectFit: 'contain', borderRadius: '4px'}}
                                                    />
                                                    <span style={{fontSize: '12px', color: '#10b981', fontWeight: '500'}}>✓ Uploaded successfully (Click to change)</span>
                                                </div>
                                            ) : (
                                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                                                    <span style={{fontSize: '24px'}}>📁</span>
                                                    <span style={{fontSize: '13px', color: '#64748b', fontWeight: '500'}}>Choose a local image file</span>
                                                    <span style={{fontSize: '11px', color: '#94a3b8'}}>PNG, JPG, WEBP (Max 1.5MB)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side: Custom Image URL */}
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                        <span style={{fontSize: '13px', fontWeight: '500', color: '#64748b'}}>Or Enter Image URL / Path</span>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', justifyContent: 'center'}}>
                                            <input
                                                type="text"
                                                name="imageCustom"
                                                value={productForm.imageCustom}
                                                placeholder="e.g. /custom_box.png or https://example.com/box.jpg"
                                                onChange={(e) => {
                                                    handleProductInputChange(e);
                                                    // clear the uploaded file if they type a URL, to keep it clean
                                                    setProductForm(prev => ({ ...prev, imageUpload: "" }));
                                                }}
                                                className={productErrors.imageCustom ? "error-border" : ""}
                                                style={{
                                                    padding: '12px 16px',
                                                    border: '2px solid #cbd5e1',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    background: '#ffffff',
                                                    width: '100%'
                                                }}
                                            />
                                            <span style={{fontSize: '11px', color: '#94a3b8', lineHeight: '1.4'}}>
                                                If you enter a URL here, it will override the uploaded file. Leave blank to use the uploaded file.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {productErrors.imageCustom && (
                                    <span className="error-text-small" style={{marginTop: '8px', display: 'block'}}>{productErrors.imageCustom}</span>
                                )}
                            </div>

                            <div className="form-group-inquiry full-width" style={{gridColumn: '1 / -1'}}>
                                <label>Short Description</label>
                                <textarea
                                    name="shortDesc"
                                    value={productForm.shortDesc}
                                    onChange={handleProductInputChange}
                                    style={{minHeight: '60px'}}
                                />
                            </div>

                            <div className="form-group-inquiry full-width" style={{gridColumn: '1 / -1'}}>
                                <label>Long Description</label>
                                <textarea
                                    name="longDesc"
                                    value={productForm.longDesc}
                                    onChange={handleProductInputChange}
                                    style={{minHeight: '100px'}}
                                />
                            </div>

                            <div className="full-width" style={{gridColumn: '1 / -1', marginTop: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                                <h3 style={{margin: 0, fontSize: '16px', color: 'var(--primary-color)'}}>Technical Specifications</h3>
                            </div>

                            <div className="form-group-inquiry">
                                <label>Board Grade</label>
                                <input
                                    type="text"
                                    name="boardGrade"
                                    value={productForm.specs.boardGrade}
                                    placeholder="e.g. 5-Ply Kraft"
                                    onChange={handleProductSpecChange}
                                />
                            </div>

                            <div className="form-group-inquiry">
                                <label>Flute Profile</label>
                                <input
                                    type="text"
                                    name="fluteProfile"
                                    value={productForm.specs.fluteProfile}
                                    placeholder="e.g. B + C Flute"
                                    onChange={handleProductSpecChange}
                                />
                            </div>

                            <div className="form-group-inquiry">
                                <label>Load Capacity</label>
                                <input
                                    type="text"
                                    name="loadCapacity"
                                    value={productForm.specs.loadCapacity}
                                    placeholder="e.g. Up to 40 kg"
                                    onChange={handleProductSpecChange}
                                />
                            </div>

                            <div className="form-group-inquiry">
                                <label>Stacking Limit</label>
                                <input
                                    type="text"
                                    name="stackingLimit"
                                    value={productForm.specs.stackingLimit}
                                    placeholder="e.g. Stacking up to 8 units"
                                    onChange={handleProductSpecChange}
                                />
                            </div>

                            <div className="form-group-inquiry">
                                <label>Cushioning</label>
                                <input
                                    type="text"
                                    name="cushioning"
                                    value={productForm.specs.cushioning}
                                    placeholder="e.g. Corrugated dividers"
                                    onChange={handleProductSpecChange}
                                />
                            </div>

                            <div className="form-group-inquiry">
                                <label>Moisture Resistance</label>
                                <input
                                    type="text"
                                    name="moistureResistance"
                                    value={productForm.specs.moistureResistance}
                                    placeholder="e.g. Medium-High"
                                    onChange={handleProductSpecChange}
                                />
                            </div>
                        </div>

                        <div className="inquiry-submit-row" style={{marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '15px'}}>
                            <button 
                                type="button" 
                                className="product-btn outline" 
                                style={{background: 'transparent', color: 'var(--primary-color)', border: '2px solid var(--primary-color)', minWidth: '140px', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'}}
                                onClick={() => {
                                    setIsAddingNew(false);
                                    setEditingProduct(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="product-btn solid"
                                style={{background: 'var(--primary-color)', color: 'white', border: 'none', minWidth: '140px', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'}}
                            >
                                Save Product
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
                <button className="modal-close" onClick={() => setSelectedMessage(null)}>&times;</button>
                
                <div className="message-detail-header">
                    <h2 style={{margin: 0, fontSize: '24px'}}>{selectedMessage.name}</h2>
                    <span style={{color: '#64748b', fontSize: '14px', display: 'block', marginTop: '4px'}}>
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
                        <p style={{textTransform: 'capitalize'}}>{selectedMessage.status}</p>
                    </div>
                </div>

                <div className="meta-item" style={{marginBottom: '8px'}}>
                    <label>MESSAGE CONTENT</label>
                </div>
                <div className="message-body">
                    {selectedMessage.message}
                </div>

                <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                    <button 
                        onClick={() => setSelectedMessage(null)}
                        style={{padding: '10px 20px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: 500}}
                    >
                        Close
                    </button>
                    <button 
                        onClick={(e) => deleteMessage(selectedMessage.id, e)}
                        style={{padding: '10px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}
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
