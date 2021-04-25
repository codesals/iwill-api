const { Feedback, User, Habit } = require("../db/models");

exports.feedbackList = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: ["id"],
      attributes: {
        exclude: ["createdAt", "updatedAt", "habitId", "userId"],
      },
      include: [
        {
          model: Habit,
          as: "habit",
          attributes: ["name"],
        },
        { model: User, as: "user", attributes: ["username"] },
      ],
    });
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

exports.feedbackCreate = async (req, res, next) => {
  try {
    // req.body.userId = req.user.id;
    const newFeedback = await Feedback.create(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

exports.feedbackDelete = async (req, res, next) => {
  const { feedbackID } = req.params;
  try {
    const foundFeedback = await Feedback.findByPk(feedbackID);
    if (foundFeedback) {
      // if (foundFeedback.userId === req.user.id) {
      await foundFeedback.destroy();
      res.status(200).json({ message: "Feedback deleted successfully!" });
      // } else res.status(401).json({ message: "UnAuthorized" });
    } else res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    next(error);
  }
};

exports.fetchFeedback = async (req, res, next) => {
  const { feedbackID } = req.params;
  try {
    const feedback = await Feedback.findByPk(feedbackID, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "username"],
      },
    });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};
