const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  habitList,
  habitCreate,
  habitDelete,
  fetchHabits,
  habitCompleted,
  PartnerHabitList,
  addPartnerToHabit,
} = require("../controllers/habitControllers");

router.get("/", habitList);
router.delete("/:habitID", habitDelete);
// router.delete(
//   "/:habitID",
//   passport.authenticate("jwt", { session: false }),
//   habitDelete
// );

router.get(
  "/partners",
  passport.authenticate("jwt", { session: false }),
  PartnerHabitList
);
router.get("/:habitID", fetchHabits);

// router.post("/", passport.authenticate("jwt", { session: false }), habitCreate);
router.post("/", passport.authenticate("jwt", { session: false }), habitCreate);
router.put("/:habitID", habitCompleted);
router.put("/:habitID/partner", addPartnerToHabit);
// router.put(
//   "/:habitID",
//   passport.authenticate("jwt", { session: false }),
//   habitCompleted
// );

// router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {

//   res.json('It worked: User ID is: ' + req.user._id);

// });
module.exports = router;
