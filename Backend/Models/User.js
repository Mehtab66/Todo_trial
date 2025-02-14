const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only required for manual signup
  auth0Id: { type: String, unique: true, sparse: true }, // Sparse allows multiple null values
});

module.exports = mongoose.model("User", userSchema);
