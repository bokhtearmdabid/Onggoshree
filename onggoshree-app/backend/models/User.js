const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Runs automatically right before a User document is saved to the database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Tier is calculated from points, not stored directly — this way it's
// always accurate and can never drift out of sync with the real point total.
const TIER_THRESHOLDS = [
  { name: "Gold", min: 1500 },
  { name: "Radiant", min: 1000 },
  { name: "Silver", min: 500 },
  { name: "Bronze", min: 0 },
];

userSchema.virtual("tier").get(function () {
  return TIER_THRESHOLDS.find((t) => this.points >= t.min).name;
});

userSchema.set("toJSON", { virtuals: true });

// Instance method: compares a plain-text login attempt against the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);