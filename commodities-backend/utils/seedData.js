const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const connectDB = require("../config/database");

// Sample data
const users = [
  {
    name: "John Manager",
    email: "manager@example.com",
    password: "Password@123",
    role: "Manager",
  },
  {
    name: "Jane Keeper",
    email: "keeper@example.com",
    password: "Password@123",
    role: "Store Keeper",
  },
];

const products = [
  {
    name: "Premium Coffee Beans",
    description: "High-quality Arabica coffee beans sourced from Colombia",
    category: "Beverages",
    price: 24.99,
    stock: 150,
    views: 1250,
    revenue: 12450,
  },
  {
    name: "Organic Honey",
    description: "Pure organic honey from local beekeepers",
    category: "Food",
    price: 15.99,
    stock: 75,
    views: 890,
    revenue: 8550,
  },
  {
    name: "Artisan Chocolate",
    description: "Handcrafted dark chocolate with 70% cocoa",
    category: "Confectionery",
    price: 18.5,
    stock: 200,
    views: 2100,
    revenue: 18900,
  },
  {
    name: "Green Tea Leaves",
    description: "Premium green tea leaves from Japan",
    category: "Beverages",
    price: 12.99,
    stock: 120,
    views: 750,
    revenue: 5200,
  },
  {
    name: "Vanilla Extract",
    description: "Pure vanilla extract for baking",
    category: "Baking",
    price: 8.99,
    stock: 60,
    views: 430,
    revenue: 2150,
  },
  {
    name: "Himalayan Pink Salt",
    description: "Natural pink salt from the Himalayas",
    category: "Condiments",
    price: 11.99,
    stock: 90,
    views: 920,
    revenue: 6840,
  },
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log("Data Destroyed...".red.inverse);

    // Create users
    const createdUsers = await User.create(users);
    console.log("Users Imported...".green.inverse);

    // Add createdBy to products
    const productsWithCreator = products.map((product) => ({
      ...product,
      createdBy: createdUsers[0]._id, // Manager creates all products
      updatedBy: createdUsers._id,
    }));

    // Create products
    await Product.create(productsWithCreator);
    console.log("Products Imported...".green.inverse);

    console.log("Data Imported Successfully!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else {
  importData();
}
