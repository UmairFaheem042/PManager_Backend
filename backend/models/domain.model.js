const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    icon: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tags: { type: [String], default: ["All"] },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Domain", domainSchema);
