const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare-at price cannot be negative"],
      default: null,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "", // we'll fill this in once we add Cloudinary for images
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "A product can have at most 5 images",
      },
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  if (this.compareAtPrice !== null && this.compareAtPrice <= this.price) {
    throw new Error("compareAtPrice must be greater than price for a discount to make sense");
  }
});

module.exports = mongoose.model("Product", productSchema);