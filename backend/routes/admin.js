const express = require("express");
const Pick = require("../models/Pick");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(adminMiddleware);

router.get("/picks", async (req, res) => {
  try {
    const picks = await Pick.find().sort({ createdAt: -1 });
    res.json(picks);
  } catch (err) {
    console.error("Admin get picks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/picks", async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Pick name required" });
  }
  try {
    const pick = new Pick({ name, description });
    await pick.save();
    res.status(201).json(pick);
  } catch (err) {
    console.error("Admin create pick error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/picks/:id", async (req, res) => {
  const { name, description } = req.body;
  try {
    const pick = await Pick.findById(req.params.id);
    if (!pick) {
      return res.status(404).json({ message: "Pick not found" });
    }
    if (name) pick.name = name;
    if (description !== undefined) pick.description = description;
    await pick.save();
    res.json(pick);
  } catch (err) {
    console.error("Admin update pick error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/picks/:id", async (req, res) => {
  try {
    const deleted = await Pick.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Pick not found" });
    }
    res.json({ message: "Pick deleted" });
  } catch (err) {
    console.error("Admin delete pick error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const UserPick = require("../models/UserPick");
const User = require("../models/User");

router.get("/user-picks", async (req, res) => {
  const picks = await UserPick.find()
    .populate("user", "firstName lastName email")
    .populate("selections.pickId", "name");

  res.json(picks);
});

// DELETE a user's pick submission
router.delete("/user-picks/:id", async (req, res) => {
  try {
    const deleted = await UserPick.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json({ message: "Submission deleted" });
  } catch (err) {
    console.error("Error deleting user submission:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
