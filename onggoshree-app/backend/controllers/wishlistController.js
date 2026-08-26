const Wishlist = require("../models/Wishlist");

// GET /api/wishlist/mine
const getMyWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate("product")
      .sort({ createdAt: -1 });

    // Filter out any entries whose product was deleted since being wishlisted
    const valid = items.filter((item) => item.product !== null);
    res.json(valid);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};

// POST /api/wishlist/toggle   body: { productId }
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const existing = await Wishlist.findOne({ user: req.user._id, product: productId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ inWishlist: false });
    }

    await Wishlist.create({ user: req.user._id, product: productId });
    res.json({ inWishlist: true });
  } catch (error) {
    res.status(400).json({ message: "Failed to update wishlist", error: error.message });
  }
};

module.exports = { getMyWishlist, toggleWishlist };