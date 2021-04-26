module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Habit", {
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    daily: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    sharedwith: {
      type: DataTypes.INTEGER,
    },
  });
};
