const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

//Middleware which decrypts a password and check if it matches with the encrypted password present in the database.

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: { username },
    });
    const passwordsMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordsMatch) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error);
  }
});
