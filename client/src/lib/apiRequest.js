import axios from "axios";

// Use absolute URL for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://burundi-location-3.onrender.com/api";

const apiRequest = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to log requests
apiRequest.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Request failed:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirecting to login");
      // You might want to redirect to login page here
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default apiRequest;