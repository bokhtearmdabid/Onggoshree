const express = require("express");
const router = express.Router();
const { getMyAddresses, createAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const protect = require("../middleware/authMiddleware");

router.get("/mine", protect, getMyAddresses);
router.post("/", protect, createAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;