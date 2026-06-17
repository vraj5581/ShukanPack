// src/apiConfig.js

// Detect if running locally (either on localhost or on a local network IP for mobile testing)
const hostname = window.location.hostname;
const isLocalDev = 
  hostname === 'localhost' || 
  hostname === '127.0.0.1' || 
  hostname.startsWith('192.168.') || 
  hostname.startsWith('10.') || 
  hostname.startsWith('172.');

/**
 * The base URL for the PHP backend API.
 * 
 * - In Development (Vite): Points to your local PHP server (e.g. XAMPP).
 *   Uses the active hostname so mobile devices on the same Wi-Fi can resolve the server.
 * - In Production: Points to the relative '/api' folder on the same hosted domain.
 */
export const API_BASE_URL = isLocalDev 
  ? `http://${hostname}/shukanpack/api` 
  : `${window.location.origin}/api`;

/**
 * Returns the authentication token (entered password) stored during login
 */
export const getAuthToken = () => {
  return sessionStorage.getItem("admin_auth") || localStorage.getItem("admin_auth_persistent") || "";
};

/**
 * Generates headers for API requests
 * @param {boolean} requireAuth Whether the request needs admin authentication
 */
export const getHeaders = (requireAuth = false) => {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (requireAuth) {
    headers["Authorization"] = getAuthToken();
  }
  
  return headers;
};
