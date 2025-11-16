import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Public API routes (no token required)
const publicEndpoints = ["/products", "/home", "products/?"];

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.startsWith(endpoint)
    );

    // Add token only on client side
    if (!isPublicEndpoint && typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Auto-detect FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// Common API Call Handler
export const apiCall = async (method, url, data = null, params = null) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
