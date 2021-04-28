const { User, Token } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const { response } = require("express");

// The function is being used to sign up a user.

exports.signup = async (req, res, next) => {
  try {
    const { password } = req.body; //to get password from request body
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // to encrypt password
    req.body.password = hashedPassword;
    const newUser = await User.create({ ...req.body }); // create a new user
    res.json({ message: "User Created Successfully" });

    // res.json({ authentication: "true", token });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res) => {
  const isSignedin = await Token.findOne({
    where: {
      token: jwt.sign(
        JSON.stringify({
          username: req.body.username,
        }),
        "asupersecretkey"
      ),
    },
  }); // verifying if a user already signed in with the provided credentials.
  if (isSignedin) {
    res.json({ authentication: false, message: "Already signed in" }); // if signed in then don't let sign in again
  } else {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    const payload = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      exp: Date.now() + 900000,
    };
    const token = jwt.sign(JSON.stringify(payload), "asupersecretkey");
    await Token.create({
      token: jwt.sign(
        JSON.stringify({
          username: payload.username,
        }),
        "asupersecretkey"
      ),
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
        let buff = fs.readFileSync(`./photos/${updatedUser.username}.jpeg`);
        let base64data = buff.toString("base64");
        res.json({ ...updatedUser?.dataValues, photo: base64data });

        // let buff1 = new Buffer(base64data, "base64"); string to image
        // fs.writeFileSync("stack-abuse-logo-out.png", buff1); naming that image
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: { exclude: ["password"] },
    });

    if (user) {
      let buff = fs.readFileSync(`./photos/${user.username}.jpeg`);
      let base64data = buff.toString("base64");
      res.json({ ...user?.dataValues, photo: base64data });
    } else {
      res.send("User not Found");
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    var users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (users) {
      // let buff = fs.readFileSync(`./photos/${user.username}.jpeg`);
      // let base64data = buff.toString("base64");
      // res.json({ ...user?.dataValues, photo: base64data });
      users.map((user, index) => {
        let buff = fs.readFileSync(`./photos/${user.username}.jpeg`);
        let base64data = buff.toString("base64");
        users[index] = { ...user?.dataValues, photo: base64data };
      });
      res.json({ users: users });
    } else {
      res.send("No User in the database");
    }
  } catch (error) {
    next(error);
  }
};
