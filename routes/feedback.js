const express = require("express");
const router = express.Router();

const {
  feedbackList,
  feedbackCreate,
  feedbackDelete,
  fetchFeedback,
} = require("../controllers/feedbackControllers");

router.get("/", feedbackList);
router.post("/", feedbackCreate);
router.delete("/:feedbackID", feedbackDelete);
router.get("/:feedbackID", fetchFeedback);

module.exports = router;
