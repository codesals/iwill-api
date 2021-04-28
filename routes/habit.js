const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  habitList,
  habitCreate,
  habitDelete,
  fetchHabits,
  addPartner,
} = require("../controllers/habitControllers");

router.get("/", habitList);
// router.post("/", habitCreate);
router.delete(
  "/:habitID",
  passport.authenticate("jwt", { session: false }),
  habitDelete
);
router.get("/:habitID", fetchHabits);

router.post("/:userID", habitCreate);
router.post("/addPartner/:habitID", addPartner);

// router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {

//   res.json('It worked: User ID is: ' + req.user._id);

// });
module.exports = router;
