module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define("Token", {
    token: {
      type: DataTypes.STRING(1234),
      allowNull: false,
      unique: true,
    },
    time: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return Token;
};
