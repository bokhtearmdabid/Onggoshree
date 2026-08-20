require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const path = require("path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));
app.use("/api/auth", authRoutes);
app.use("/api/rewards", rewardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});