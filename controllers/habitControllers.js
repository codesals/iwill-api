const { Habit, User } = require("../db/models");

exports.habitList = async (req, res, next) => {
  try {
    const habits = await Habit.findAll({
      order: ["id"],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

      include: {
        model: User,
        as: "user",
        attributes: ["username"],
      },
    });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};

exports.habitCreate = async (req, res, next) => {
  try {
    // req.body.userId = req.user.id;
    const newHabit = await Habit.create(req.body);
    res.status(201).json(newHabit);
  } catch (error) {
    next(error);
  }
};

exports.habitDelete = async (req, res, next) => {
  const { habitID } = req.params;
  try {
    const foundHabit = await Habit.findByPk(habitID);
    if (foundHabit) {
      // if (foundHabit.userId === req.user.id) {
      await foundHabit.destroy();
      res.status(200).json({ message: "Habit deleted successfully!" });
      // } else res.status(401).json({ message: "UnAuthorized" });
    } else res.status(404).json({ message: "Habit not found!" });
  } catch (error) {
    next(error);
  }
};

exports.fetchHabits = async (req, res, next) => {
  const { habitID } = req.params;
  try {
    const habit = await Habit.findByPk(habitID, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "username"],
      },
    });
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

exports.habitCompleted = async (req, res, next) => {
  const { habitID } = req.params;
  try {
    const foundHabit = await Habit.findByPk(habitID);
    if (foundHabit) {
      const completedHabit = await foundHabit.update(req.body);
      res.status(200).json(completedHabit);
    } else res.status(404).json({ message: "Habit not found!" });
  } catch (error) {
    next(error);
  }
};
