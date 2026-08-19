const User = require("../models/User");

const DISCOUNT_REWARD = {
  label: "৳100 off any order",
  cost: 500,
  discountAmount: 100,
};

// POST /api/rewards/redeem-discount  (protected)
const redeemDiscount = async (req, res) => {
  try {
    const user = req.user;

    if (user.activeReward) {
      return res.status(400).json({ message: "You already have an unused reward. Use it at checkout first." });
    }

    if (user.points < DISCOUNT_REWARD.cost) {
      return res.status(400).json({ message: `You need ${DISCOUNT_REWARD.cost} points to redeem this.` });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: { points: -DISCOUNT_REWARD.cost },
        activeReward: { label: DISCOUNT_REWARD.label, discountAmount: DISCOUNT_REWARD.discountAmount },
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to redeem reward", error: error.message });
  }
};

module.exports = { redeemDiscount };