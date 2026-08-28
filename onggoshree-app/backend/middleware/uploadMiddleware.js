const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  filename: (req, file, cb) => {
    // Prefix with a timestamp so two uploads with the same original filename
    // (e.g. two admins both uploading "photo.jpg") never overwrite each other.
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

module.exports = upload;