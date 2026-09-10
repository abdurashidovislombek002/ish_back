const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const JobSeekerProfile = sequelize.define("JobSeekerProfile", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  skills: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  cv_url: { type: DataTypes.STRING(500) },
  experience: { type: DataTypes.TEXT },
}, { tableName: "job_seeker_profiles", timestamps: true, createdAt: "created_at", updatedAt: false });

module.exports = JobSeekerProfile;
