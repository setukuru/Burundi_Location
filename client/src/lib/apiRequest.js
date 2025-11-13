import axios from "axios";
// import config from "../../config";

const apiRequest = axios.create({
  baseURL:  "https://burundi-location-3.onrender.com/api" || "http://localhost:8800/api",
  withCredentials: true, // BECAUSE OF THE USE OF COOKIES
});

export default apiRequest;