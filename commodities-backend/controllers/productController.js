const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 50,
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(query)
      .populate("createdBy", "name role")
      .populate("updatedBy", "name role")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name role")
      .populate("updatedBy", "name role");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;

    const product = await Product.create(req.body);

    // Populate user information
    await product.populate("createdBy", "name role");
    await product.populate("updatedBy", "name role");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Add updatedBy to req.body
    req.body.updatedBy = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name role")
      .populate("updatedBy", "name role");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Manager only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    product.updatedBy = req.user.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/products/stats/dashboard
// @access  Private (Manager only)
const getDashboardStats = async (req, res, next) => {
  try {
    // Get basic counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Product.distinct("category", {
      isActive: true,
    });

    // Get aggregated stats
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalRevenue: { $sum: "$revenue" },
          totalStock: { $sum: "$stock" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$revenue" },
          totalStock: { $sum: "$stock" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get top products
    const topProducts = await Product.find({ isActive: true })
      .sort({ revenue: -1 })
      .limit(5)
      .select("name category price views revenue stock");

    const dashboardData = {
      totalProducts,
      totalCategories: totalCategories.length,
      totalViews: stats[0]?.totalViews || 0,
      totalRevenue: stats?.totalRevenue || 0,
      totalStock: stats?.totalStock || 0,
      avgPrice: Math.round((stats?.avgPrice || 0) * 100) / 100,
      categoryDistribution: categoryStats,
      topProducts,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
};
