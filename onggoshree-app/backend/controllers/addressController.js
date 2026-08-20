const Address = require("../models/Address");

// GET /api/addresses/mine
const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
  }
};

// POST /api/addresses
const createAddress = async (req, res) => {
  try {
    const { label, fullAddress, phone, isDefault } = req.body;

    if (!label || !fullAddress || !phone) {
      return res.status(400).json({ message: "Label, address, and phone are all required" });
    }

    // If this new address is marked default, un-default all the user's other addresses first
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      label,
      fullAddress,
      phone,
      isDefault: !!isDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: "Failed to create address", error: error.message });
  }
};

// PUT /api/addresses/:id
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    // Confirm this address actually belongs to the logged-in user —
    // otherwise anyone could edit anyone else's saved address just by ID.
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this address" });
    }

    const { label, fullAddress, phone, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    address.label = label ?? address.label;
    address.fullAddress = fullAddress ?? address.fullAddress;
    address.phone = phone ?? address.phone;
    address.isDefault = isDefault ?? address.isDefault;

    const updated = await address.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update address", error: error.message });
  }
};

// DELETE /api/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this address" });
    }

    await address.deleteOne();
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error: error.message });
  }
};

module.exports = { getMyAddresses, createAddress, updateAddress, deleteAddress };