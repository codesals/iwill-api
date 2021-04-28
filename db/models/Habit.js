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
    partner: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    daily: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    allowNull: false,
    },
    compeleted: {
      type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    },

    sharedwith: {
      type: DataTypes.INTEGER,
      //   allowNull: false,
    },
  });
};
