const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("User", UserSchema);
