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
      exp: Date.now() + 900000,
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
  const user = req.user;
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + 900000,
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

// exports.edit_profile = async (req, res, next) => {  //auth and itwill get from req.body
//   try {
//     const { userId } = req.params; // to get user id from request params.

//     const user = await User.findOne({
//       where: {
//         id: userId,
//       },
//     }); // get the user of that specific id

//     if (user) {
//       user.fullname = req.body.fullname ? req.body.fullname : user.fullname;
//       user.password = req.body.password ? req.body.password : user.password;
//       user.email = req.body.email ? req.body.email : user.email;
//       user.photo = req.body.photo ? req.body.photo : user.photo;
//       user.date_of_birth = req.body.date_of_birth
//         ? req.body.date_of_birth
//         : user.date_of_birth;
//       user.username = req.body.username ? req.body.username : user.username;
//       user.phone = req.body.phone ? req.body.phone : user.phone;
//       await user.save(); // update and then save all the attributes accourding to the values provided.
//       res.send("Updated");
//     } else {
//       res.send("User not found");
//     }
//   } catch (error) {
//     next(error);
//   }
// };
