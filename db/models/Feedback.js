module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Feedback", {
    comment: {
      type: DataTypes.STRING,
    },
  });
};
