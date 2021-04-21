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
      id: newUser.id,
      username: newUser.username,
      fullname: newUser.fullname,
      email: newUser.email,
      dateOfBirth: newUser.dateOfBirth,
      phone: newUser.phone,
      exp: Date.now() + 900000,
    };

    const token = jwt.sign(JSON.stringify(payload), "asupersecretkey"); // create web token using jwt
    console.log(token);
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
    token: token,
    time: Date.now() + 900000, // otherwise signin the user with expiry time of 15 minutes.
  });
  res.json({ authentication: "true", token });
  // }
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
