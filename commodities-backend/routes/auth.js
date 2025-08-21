const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

// Public routes
router.post("/register", validateRegister, handleValidationErrors, register);
router.post("/login", validateLogin, handleValidationErrors, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
