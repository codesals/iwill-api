const express = require("express");
const router = express.Router();

const {
  habitList,
  habitCreate,
  habitDelete,
  fetchHabits,
} = require("../controllers/habitControllers");

router.get("/", habitList);
router.post("/", habitCreate);
router.delete("/:habitID", habitDelete);
router.get("/:habitID", fetchHabits);

module.exports = router;
