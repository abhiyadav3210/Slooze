const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");
const {
  validateProduct,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard stats route - Manager only
router.get("/stats/dashboard", authorize("Manager"), getDashboardStats);

// Main product routes
router.get("/", getProducts);
router.post("/", validateProduct, handleValidationErrors, createProduct);

// Individual product routes
router.get("/:id", getProduct);
router.put("/:id", validateProduct, handleValidationErrors, updateProduct);
router.delete("/:id", authorize("Manager"), deleteProduct);

module.exports = router;
