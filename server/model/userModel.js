const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,  //required to create an account
    min: 3,
    max: 20,
    unique: true,  //only one username can have this name
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "", //This stores the URL or path to the user's avatar image. If no avatar is set, this will be an empty string.
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
