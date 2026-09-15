const User = require("./User");
const Company = require("./Company");
const JobSeekerProfile = require("./JobSeekerProfile");
const Job = require("./Job");
const Application = require("./Application");
const Role = require("./Role");

// User -> Company (owner)
User.hasOne(Company, { foreignKey: "owner_id", as: "company" });
Company.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// User -> JobSeekerProfile
User.hasOne(JobSeekerProfile, { foreignKey: "user_id", as: "profile" });
JobSeekerProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Company -> Jobs
Company.hasMany(Job, { foreignKey: "company_id", as: "jobs" });
Job.belongsTo(Company, { foreignKey: "company_id", as: "company" });

// Job -> Applications
Job.hasMany(Application, { foreignKey: "job_id", as: "applications" });
Application.belongsTo(Job, { foreignKey: "job_id", as: "job" });

// User (seeker) -> Applications
User.hasMany(Application, { foreignKey: "seeker_id", as: "applications" });
Application.belongsTo(User, { foreignKey: "seeker_id", as: "seeker" });

// Company -> Roles
Company.hasMany(Role, { foreignKey: "company_id", as: "roles" });
Role.belongsTo(Company, { foreignKey: "company_id", as: "company" });

// Role -> Applications (nomzodga biriktirilgan rol)
Role.hasMany(Application, { foreignKey: "assigned_role_id", as: "applications" });
Application.belongsTo(Role, { foreignKey: "assigned_role_id", as: "role" });

module.exports = { User, Company, JobSeekerProfile, Job, Application, Role };
