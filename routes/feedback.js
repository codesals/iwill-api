const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  feedbackList,
  feedbackCreate,
  feedbackDelete,
  fetchFeedback,
} = require("../controllers/feedbackControllers");

router.get("/", feedbackList);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  feedbackCreate
);
router.delete(
  "/:feedbackID",
  passport.authenticate("jwt", { session: false }),
  feedbackDelete
);
router.get("/:feedbackID", fetchFeedback);

module.exports = router;
