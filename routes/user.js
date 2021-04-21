const express = require("express");
const passport = require("passport");
const router = express.Router();
const db = require("../db/models");
const { Op } = require("sequelize");

const {
  signup,
  signin,
  signout,
  edit_profile,
} = require("../controllers/userControllers");

// /* GET users listing. */
router.get("/", async (req, res) => {
  const users = await db.User.findAll(); //edit exclude
  res.json(users);
 });

const tokenTimeOut = async () => {
  //Function that checks if the expiry time of any user token has passed.
  const time = Date.now();
  await db.Token.destroy({
    where: {
      time: {
        [Op.lt]: time,
      },
    },
  });
};

setInterval(function () {
  tokenTimeOut(); // We can the function to check expired token after every 1 second.
}, 1000);

router.post("/signup", signup);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);


router.get("/profile/:userId", async (req, res) => {
  const user = await db.User.findOne({
    where: { id: req.params.userId },
    attributes: { exclude: ["password"] },
  });
  if (user) {
    res.json(user);
  } else {
    res.send("User not Found");
  }
});

router.put("/edit/:userId", edit_profile);

module.exports = router;
