const express = require("express");
const passport = require("passport");
const router = express.Router();
const db = require("../db/models");
const { Op } = require("sequelize");
var fs = require("fs");

const {
  signup,
  signin,
  signout,
  edit_profile,
} = require("../controllers/userControllers");

var multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./photos");
  },
  filename: function (req, file, callback) {
    callback(null, req.body.username + ".jpeg");
  },
});

var upload = multer({ storage: storage });

/* GET users listing. */
router.get("/profile/:userId", async (req, res) => {
  const user = await db.User.findOne({
    where: { id: req.params.userId },
    attributes: { exclude: ["password"] },
  });
  if (user) {
    let buff = fs.readFileSync(`./photos/${user.username}.jpeg`);
        let base64data = buff.toString("base64");
        res.json({ ...user, photo: base64data });
  } else {
    res.send("User not Found");
  }
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

router.post("/signup", upload.single("profile"), signup);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

router.put("/edit/:userId", edit_profile);

module.exports = router;
