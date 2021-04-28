module.exports = (sequelize, DataTypes) => {
  const HabitPartners = sequelize.define(
    "HabitPartners",
    {
      // partner: {
      //   type: DataTypes.STRING,
      // },
    },
    { timestamps: false }
  );

  return HabitPartners;
};
