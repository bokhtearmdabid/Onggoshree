require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Add Product here!
const products = [
  {
    name: "Chlorophyll Facial",
    description:
      "Deep-cleans and detoxes from within for a natural, parlour-free glow. Formulated with chlorophyll, Vitamin E, protein, and fatty acids.",
    price: 399,
    category: "Facial",
    stock: 40,
    imageUrl: "https://onggoshree.onrender.com/images/products/chlorophyll-facial.jpg",
  },
  {
    name: "Acno Facial",
    description:
      "A gentle, purifying facial treatment that targets breakouts and excess oil while keeping skin balanced and calm.",
    price: 399,
    category: "Facial",
    stock: 35,
    imageUrl: "https://onggoshree.onrender.com/images/products/acno-facial.jpg",
  },
  {
    name: "Pure Glow Serum",
    description:
      "A lightweight, fast-absorbing serum that brightens dull skin and locks in hydration for a natural radiance.",
    price: 999,
    compareAtPrice: 1199,
    category: "Serum",
    stock: 25,
    imageUrl: "https://onggoshree.onrender.com/images/products/pure-glow-serum.jpg"
  },
  {
    name: "Acno Gel",
    description:
      "A targeted spot gel that reduces acne and inflammation without drying out surrounding skin.",
    price: 799,
    category: "Gel",
    stock: 30,
    imageUrl: "https://onggoshree.onrender.com/images/products/acno-gel.jpg"
  },
  {
    name: "Chlorophyll Bar",
    description:
      "A gentle cleansing bar infused with chlorophyll to detoxify and refresh skin with every wash.",
    price: 399,
    category: "Bar",
    stock: 50,
    imageUrl: "https://onggoshree.onrender.com/images/products/chlorophyll-bar.jpg"
  },
  {
  name: "Keshraj Hair Oil",
  description:
    "A traditional herbal hair oil that strengthens roots, reduces hair fall, and adds natural shine.",
  price: 350,
  compareAtPrice: 599,
  category: "Hair",
  stock: 45,
  imageUrl: "https://onggoshree.onrender.com/images/products/keshraj-hair-oil.jpg",
  images: [
    "https://onggoshree.onrender.com/images/products/keshraj-hair-oil.jpg",
    "https://onggoshree.onrender.com/images/products/keshraj-hair-oil-2.jpg",
    "https://onggoshree.onrender.com/images/products/keshraj-hair-oil-3.jpg",
    ],
  },


  //Merchandise
  {
  name: "Onggoshree Tote Bag",
  description: "A sturdy canvas tote featuring our signature mark — perfect for carrying your daily essentials.",
  price: 129,
  category: "Merchandise",
  stock: 60,
  imageUrl: "https://onggoshree.onrender.com/images/products/merch-tote-bag.jpg",
  },
  {
    name: "Glow Club Enamel Pin",
    description: "A collectible enamel pin celebrating your Glow Club journey.",
    price: 99,
    category: "Merchandise",
    stock: 100,
    imageUrl: "https://onggoshree.onrender.com/images/products/merch-pin.jpg",
  },
  {
    name: "Onggoshree Ceramic Mug",
    description: "Start your skincare ritual mornings right with this hand-finished ceramic mug.",
    price: 350,
    category: "Merchandise",
    stock: 40,
    imageUrl: "https://onggoshree.onrender.com/images/products/merch-mug.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected — seeding...");

    await Product.deleteMany({}); // clear existing products first
    console.log("Old products cleared");

    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully`);

    process.exit(0); // success — exit cleanly
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1); // failure — exit with error code
  }
};

seedDatabase();