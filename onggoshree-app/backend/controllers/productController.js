const Product = require("../models/Product");

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;
    const product = await Product.create({ name, description, price, category, imageUrl, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error: error.message });
  }
};

// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// POST /api/products/upload-image  (admin only)
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/images/products/${req.file.filename}`;
  res.json({ imageUrl });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};