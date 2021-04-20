const { User, Token } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// The function is being used to sign up a user.

exports.signup = async (req, res, next) => {
  try {
    const { password } = req.body; //to get password from request body
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // to encrypt password
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body); // create a new user
    const payload = {
      id: req.body.id,
      username: req.body.username,
    };
    const token = jwt.sign(JSON.stringify(payload), "asupersecretkey"); // create web token using jwt
    await Token.create({
      token: token,
      time: Date.now() + 900000,
    }); // Creating token that will be expired in 15 minutes
    res.json({ authentication: "true", token });
  } catch (error) {
    next(error);
  }
};



exports.signin = async (req, res) => {
  const user = req.body;
  const payload = {
    id: user.id,
    username: user.username,
  };
  const token = jwt.sign(JSON.stringify(payload), "asupersecretkey");
  const isSignedin = await Token.findOne({
    where: {
      token: token,
    },
  }); // verifying if a user already signed in with the provided credentials.
  if (isSignedin) {
    res.json({ authentication: false, message: "Already signed in" }); // if signed in then don't let sign in again
  } else {
    await Token.create({
      token: token,
      time: Date.now() + 900000, // otherwise signin the user with expiry time of 15 minutes.
    });
    res.json({ authentication: "true", token });
  }
};

exports.edit_profile = async (req, res, next) => {
  try {
    User.update(req.body, {
      returning: true,
      where: { id: req.params.userId },
    })
      .then(function ([rowsUpdate, [updatedUser]]) {
        res.json(updatedUser);
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
};
