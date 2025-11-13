const config = {

  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api",

  SOCKET_BASE_URL: import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:5001",

  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || "http://localhost:5174"
  
};

export default config;