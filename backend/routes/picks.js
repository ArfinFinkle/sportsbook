const express = require("express");
const Pick = require("../models/Pick");
const UserPick = require("../models/UserPick");
const authMiddleware = require("../middleware/authMiddleware"); // <-- this line fixes it!


const router = express.Router();



// Get available picks
router.get("/", async (req, res) => {
  try {
    const picks = await Pick.find().sort({ createdAt: -1 });
    res.json(picks);
  } catch (err) {
    console.error("Get picks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Submit picks
router.post("/submit", async (req, res) => {
  const userId = req.user._id;
  const selections = req.body.selections;

  if (!Array.isArray(selections)) {
    return res.status(400).json({ message: "Invalid selections format." });
  }

  await UserPick.create({
    user: userId,
    selections,
    submittedAt: new Date()
  });

  res.json({ message: "Picks submitted!" });
});

// GET my submissions
router.get("/my-submissions", authMiddleware, async (req, res) => {
  try {
    const submissions = await UserPick.find({ user: req.user._id })
      .populate("selections.pickId", "name")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("Error getting my submissions:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
