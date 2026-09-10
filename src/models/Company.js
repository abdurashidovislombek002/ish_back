const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Company = sequelize.define("Company", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  industry: { type: DataTypes.STRING(100) },
  address: { type: DataTypes.STRING(300) },
  description: { type: DataTypes.TEXT },
}, { tableName: "companies", timestamps: true, createdAt: "created_at", updatedAt: false });

module.exports = Company;
