const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Application = sequelize.define("Application", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.ENUM("pending", "accepted", "rejected"), defaultValue: "pending" },
  offered_role: { type: DataTypes.STRING(100) },
  assigned_role_id: { type: DataTypes.INTEGER },
  message: { type: DataTypes.TEXT },
}, { tableName: "applications", timestamps: true, createdAt: "created_at", updatedAt: false });

module.exports = Application;
