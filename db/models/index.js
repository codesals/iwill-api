"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Habit, {
  foreignKey: "userId",
  // allowNull: false,
  as: "habits",
});

db.User.hasMany(db.Feedback, {
  foreignKey: "userId",
  // allowNull: false,
  as: "feedbacks",
});

db.Habit.hasMany(db.Feedback, {
  foreignKey: "habitId",
  // allowNull: false,
  as: "feedbacks",
});

db.Habit.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

db.Feedback.belongsTo(db.Habit, {
  foreignKey: "habitId",
  as: "habits",
});
db.Feedback.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
