import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous redirects
let isRedirecting = false;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with infinite loop protection
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Prevent infinite loops by checking if we're already redirecting
      if (!isRedirecting) {
        isRedirecting = true;

        // Clean up auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login after a short delay to prevent multiple redirects
        setTimeout(() => {
          window.location.href = "/login";
          isRedirecting = false;
        }, 100);
      }

      // Return a rejected promise to stop further processing
      return Promise.reject(new Error("Authentication required"));
    }

    // Return structured error for other errors
    const errorMessage = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);

// API methods remain the same
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
};

export const productsAPI = {
  getAll: (params = {}) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post("/products", productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getDashboardStats: () => api.get("/products/stats/dashboard"),
};
