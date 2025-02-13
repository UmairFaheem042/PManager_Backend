const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    domains: [{ type: mongoose.Schema.Types.ObjectId, ref: "Domain" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
