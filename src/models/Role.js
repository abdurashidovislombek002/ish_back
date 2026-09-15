const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define("Role", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  company_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: "roles", timestamps: true, createdAt: "created_at", updatedAt: false });

module.exports = Role;
