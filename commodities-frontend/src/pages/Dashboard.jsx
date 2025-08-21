import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useProducts } from "../context/ProductContext";
import { useEffect } from "react";
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  Sun,
  Moon,
  LogOut,
  Package,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { products, loading, fetchDashboardStats, } = useProducts();
  const navigate = useNavigate();

   useEffect(() => {
     if (user?.role === "Manager") {
       fetchDashboardStats();
     }
   }, [user?.role]);

   const stats = {
     totalProducts: products.length,
     totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
     totalEarnings: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
     totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
   };


  // Get top performing products
  const topProducts = products
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Get category distribution
  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manager Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <button
                onClick={() => navigate("/products")}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
              >
                Manage Products
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProducts}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {stats.categories} categories
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalViews.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  <BarChart3 className="inline h-3 w-3 mr-1" />
                  Analytics tracking
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Earnings
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Revenue growth
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Total Stock */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Stock
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalStock}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  <Package className="inline h-3 w-3 mr-1" />
                  Inventory items
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Products */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performing Products
            </h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.views} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => {
                const percentage = Math.round(
                  (count / stats.totalProducts) * 100
                );
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {count} products
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center justify-center px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Manage Products
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Check Inventory
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
