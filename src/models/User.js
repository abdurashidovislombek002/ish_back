const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("seeker", "company_owner"), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
}, { tableName: "users", timestamps: true, createdAt: "created_at", updatedAt: false });

module.exports = User;
