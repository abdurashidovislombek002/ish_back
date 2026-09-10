const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define("Job", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.TEXT },
  salary_min: { type: DataTypes.INTEGER },
  salary_max: { type: DataTypes.INTEGER },
  location: { type: DataTypes.STRING(200) },
  category: { type: DataTypes.STRING(100) },
  status: { type: DataTypes.ENUM("active", "closed"), defaultValue: "active" },
}, { tableName: "jobs", timestamps: true, createdAt: "created_at", updatedAt: false });

module.exports = Job;
