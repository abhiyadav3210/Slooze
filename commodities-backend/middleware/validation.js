const { body, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body("name"       )
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("role")
    .isIn(["Manager", "Store Keeper"])
    .withMessage("Role must be either Manager or Store Keeper"),
];

// User login validation
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

// Product validation
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Product name must be between 1 and 200 characters"),

  body("category")
    .isIn([
      "Beverages",
      "Food",
      "Confectionery",
      "Baking",
      "Condiments",
      "Dairy",
      "Spices",
      "Other",
    ])
    .withMessage("Please select a valid category"),

  body("price")
    .isFloat({ min: 0, max: 99999.99 })
    .withMessage("Price must be a positive number up to 99999.99"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateProduct,
};
