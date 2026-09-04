const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client();
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { welcomeEmail, orderConfirmationEmail, adminNewOrderEmail, otpEmail } = require("../utils/emailTemplates");

// Creates a signed token containing the user's ID, valid for 30 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // always 6 digits
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  return { otp, otpHash };
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are all required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const { otp, otpHash } = generateOTP();

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otpHash,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    sendEmail({ to: user.email, ...otpEmail(user.name, otp) });

    // No token yet — the account isn't usable until verified
    res.status(201).json({ email: user.email, message: "Verification code sent to your email" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Deliberately vague error message — never reveal whether the email
    // exists or the password was wrong specifically. That distinction is
    // exactly the kind of detail that helps attackers guess valid accounts.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first", needsVerification: true, email: user.email });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "No ID token provided" });
    }

    // Cryptographically verifies the token was genuinely issued by Google
    // for OUR project specifically — not just any valid Google token.
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
    user = await User.create({ name, email: email.toLowerCase(), googleId, isVerified: true });
    sendEmail({ to: user.email, ...welcomeEmail(user.name) });
  }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401).json({ message: "Google sign-in failed", error: error.message });
  }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+otpHash +otpExpires");

    if (!user || !user.otpHash) {
      return res.status(400).json({ message: "No pending verification for this account" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Code has expired. Please request a new one." });
    }

    const submittedHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (submittedHash !== user.otpHash) {
      return res.status(400).json({ message: "Incorrect code" });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendEmail({ to: user.email, ...welcomeEmail(user.name) }); // welcome email now, on real verification

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

  // POST /api/auth/resend-otp
  const resendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email?.toLowerCase() });

      if (!user) {
        return res.status(404).json({ message: "No account found with this email" });
      }
      if (user.isVerified) {
        return res.status(400).json({ message: "This account is already verified" });
      }

      const { otp, otpHash } = generateOTP();
      user.otpHash = otpHash;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      sendEmail({ to: user.email, ...otpEmail(user.name, otp) });

      res.json({ message: "A new code has been sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to resend code", error: error.message });
    }
  };

// GET /api/auth/me  (protected — requires a valid token)
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe, googleLogin, verifyOTP, resendOTP };