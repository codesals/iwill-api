const express = require("express");
const router = express.Router();

const {
  habitList,
  habitCreate,
  habitDelete,
  fetchHabit,
} = require("../controllers/habitControllers");

router.get("/", habitList);
router.post("/", habitCreate);
router.delete("/:habitID", habitDelete);
router.get("/:habitID", fetchHabit);

module.exports = router;
