import axios from "axios";
import config from "../../config";

const apiRequest = axios.create({
  baseURL: config.API_BASE_URL || "http://localhost:8800/api",
  withCredentials: true, // BECAUSE OF THE USE OF COOKIES
});

export default apiRequest;