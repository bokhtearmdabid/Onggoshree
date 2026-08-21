require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const email = process.argv[2];

const run = async () => {
  if (!email) {
    console.log("Usage: node makeAdmin.js your@email.com");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isAdmin: true },
    { new: true }
  );

  if (!user) {
    console.log("No user found with that email.");
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  process.exit(0);
};

run();