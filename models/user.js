"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      picture: DataTypes.STRING,
      confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
      status: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
