import { useState, useEffect } from "react";
import "../styles/pages.css"; // Base styles
import "../styles/admin.css"; // Admin specific styles
import { useNavigate } from "react-router-dom";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'messages' | 'settings'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  // Handle window resize
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
                            <p>Total Messages</p>
                        </div>
                    </div>
                    <div className="stat-card green">🆕</div>
                    <div className="stat-info">
                        <h3>{unreadMessages}</h3>
                        <p>Unread Messages</p>
                    </div>
                    <div className="stat-card purple">📅</div>
                    <div className="stat-info">
                        <h3>{todayMessages}</h3>
                        <p>Received Today</p>
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
                                    <th>Status</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.slice(0, 5).map((msg) => (
                                    <tr key={msg.id} onClick={() => viewMessage(msg)} style={{cursor: 'pointer'}}>
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
                                ))}
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
                                    + "Date,Name,Email,Message,Status\n"
                                    + messages.map(e => `${e.date},${e.name},${e.email},"${e.message.replace(/"/g, '""')}",${e.status}`).join("\n");
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
                                .map((msg) => (
                                <tr key={msg.id} onClick={() => viewMessage(msg)} style={{cursor: 'pointer'}}>
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
                            ))}
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
