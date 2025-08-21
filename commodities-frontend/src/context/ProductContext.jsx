import { createContext, useContext, useState, useEffect, useRef } from "react";
import { productsAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const { user } = useAuth();
  const fetchingRef = useRef(false);

  // Fetch products only when user is authenticated
  const fetchProducts = async (params = {}) => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current || !user) return;

    try {
      fetchingRef.current = true;
      setLoading(true);
      const response = await productsAPI.getAll(params);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const fetchDashboardStats = async () => {
    if (!user || user.role !== "Manager") return;

    try {
      const response = await productsAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Only fetch when user is available and authenticated
  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      // Reset state when user logs out
      setProducts([]);
      setDashboardStats(null);
      setLoading(false);
    }
  }, [user]); // Depend on user object

  const addProduct = async (productData) => {
    try {
      const response = await productsAPI.create(productData);
      setProducts((prev) => [response.data, ...prev]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productsAPI.update(id, productData);
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? response.data : product))
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getProduct = (id) => {
    return products.find((product) => product._id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        dashboardStats,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        fetchProducts,
        fetchDashboardStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
