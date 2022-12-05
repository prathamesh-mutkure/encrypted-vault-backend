const { handleError, handleSuccess } = require("../utils/handleResponse");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { expressjwt: verifyJwt } = require("express-jwt");
const User = require("../models/user_model");

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) return handleError(res, "Error retriveing the user", 400);

    if (!user) return handleError(res, "User doesn't exists", 400);

    if (!user.authenticate(password))
      return handleError(res, "Incorrect username or password!", 401);

    const { _id: id, username } = user;

    const token = jwt.sign({ id }, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "1d",
    });

    return res.json({ id, username, token });
  });
};

exports.register = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) return handleError(res, "Database error", 400);

    if (user) return handleError(res, "User already exists", 400);

    const newUser = User({ username, password });

    newUser.save().then((newUser) => {
      if (!newUser) return handleError(res, "Error registering user");

      const { _id: id, username } = newUser;

      const token = jwt.sign({ id }, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });

      return res.json({ id, username, token });
    });
  });
};

exports.isSignedIn = verifyJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
