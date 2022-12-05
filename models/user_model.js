const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
    unique: true,
  },
  encrypted_password: {
    type: String,
    required: true,
  },
  salt: String,
});

userSchema
  .virtual("password")
  .set(function (plainPassword) {
    this._password = plainPassword;
    this.salt = uuidv4();
    this.encrypted_password = this.securePassword(plainPassword);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      console.log(err);
      return "";
    }
  },

  authenticate: function (plainPassword) {
    return this.encrypted_password === this.securePassword(plainPassword);
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
