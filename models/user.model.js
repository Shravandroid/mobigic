const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    password: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.password) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

userSchema.methods.getToken = function () {
  return jwt.sign(
    { username: this.username, sub: this._id, isActive: this.isActive },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "2w" }
  );
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
