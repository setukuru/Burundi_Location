const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api",
  
  // Socket Configuration
  SOCKET_BASE_URL: import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:5001",
  
  // Client URL
  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || "http://localhost:5174"
};

export default config;