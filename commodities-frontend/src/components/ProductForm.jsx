import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

const categories = [
  { value: "Beverages", label: "Beverages" },
  { value: "Food", label: "Food" },
  { value: "Confectionery", label: "Confectionery" },
  { value: "Baking", label: "Baking" },
  { value: "Condiments", label: "Condiments" },
  { value: "Dairy", label: "Dairy" },
  { value: "Spices", label: "Spices" },
];

export default function ProductForm({ product, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        description: product.description || "",
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter product name"
        required
      />

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categories}
        error={errors.category}
        placeholder="Select a category"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
          required
        />

        <Input
          label="Stock Quantity"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
          placeholder="Enter product description..."
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {product ? "Update Product" : "Add Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
