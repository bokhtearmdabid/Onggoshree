const adminOnly = (req, res, next) => {
  // This must run AFTER the `protect` middleware, since it depends on
  // req.user already being set from a verified token.
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = adminOnly;