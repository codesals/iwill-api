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
    req.body.userId = req.params.userID;
    const newHabit = await Habit.create(req.body);
    res.status(201).json(newHabit);
  } catch (error) {
    next(error);
  }
};

exports.addPartner = async (req, res, next) => {
  try {
    const habitID = req.params.habitID;
    const habit = await Habit.findOne({
      where: {
        id: habitID,
      },
    });

    if (habit.partner?.length > 0) {
      habit.partner = [...habit.partner, req.body.userID];
    } else {
      habit.partner = [req.body.userID];
    }
    habit.partner = [...new Set(habit.partner)];
    await habit.save();
    res.json(habit);
  } catch (error) {
    next(error);
  }
};

exports.habitDelete = async (req, res, next) => {
  const { habitID } = req.params;
  try {
    const foundHabit = await Habit.findByPk(habitID);
    if (foundHabit) {
      if (foundHabit.userId === req.user.id) {
        await foundHabit.destroy();
        res.status(200).json({ message: "Habit deleted successfully!" });
      } else res.status(401).json({ message: "UnAuthorized" });
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
