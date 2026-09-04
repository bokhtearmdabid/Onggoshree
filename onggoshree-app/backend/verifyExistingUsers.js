require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await User.updateMany({ isVerified: false }, { isVerified: true });

  console.log(`${result.modifiedCount} existing account(s) marked as verified.`);
  process.exit(0);
};

run();