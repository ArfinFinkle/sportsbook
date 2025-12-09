const mongoose = require("mongoose");

const userPickSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selections: [
    {
      pickId: { type: mongoose.Schema.Types.ObjectId, ref: "Pick" },
      choice: { type: String, enum: ["over", "under"] }
    }
  ]
}, { timestamps: true }); // ✅ createdAt + updatedAt will be added automatically

module.exports = mongoose.model("UserPick", userPickSchema);
