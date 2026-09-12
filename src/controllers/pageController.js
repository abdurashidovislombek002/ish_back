const { Op } = require("sequelize");
const { Job, Company, User, Role, Application, JobSeekerProfile } = require("../models");
const { mapJob, mapApplication } = require("../utils/serialize");

exports.getCategories = async (_req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { category: { [Op.ne]: null } },
      attributes: ["category"],
    });
    const list = [...new Set(jobs.map((j) => j.category).filter(Boolean))].sort();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getLocations = async (_req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { location: { [Op.ne]: null } },
      attributes: ["location"],
    });
    const list = [...new Set(jobs.map((j) => j.location).filter(Boolean))].sort();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getMyJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.json([]);

    const jobs = await Job.findAll({
      where: { company_id: company.id },
      include: [{ model: Application, as: "applications", attributes: ["id", "status"] }],
      order: [["created_at", "DESC"]],
    });

    res.json(jobs.map(mapJob));
  } catch (err) {
    next(err);
  }
};

exports.getMyRoles = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.json([]);

    const roles = await Role.findAll({ where: { company_id: company.id }, order: [["id", "DESC"]] });
    res.json(roles.map((r) => ({ id: r.id, name: r.name, description: r.description })));
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { seeker_id: req.user.id },
      include: [
        {
          model: Job,
          as: "job",
          include: [{ model: Company, as: "company", attributes: ["id", "name"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(applications.map(mapApplication));
  } catch (err) {
    next(err);
  }
};

exports.createApplicationForm = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });
    if (job.status !== "active") return res.status(400).json({ error: "Bu ish yopilgan" });

    const existing = await Application.findOne({ where: { job_id: jobId, seeker_id: req.user.id } });
    if (existing) return res.status(400).json({ error: "Siz allaqachon ariza bergansiz" });

    const application = await Application.create({
      job_id: jobId,
      seeker_id: req.user.id,
      message: coverLetter || null,
    });

    res.status(201).json(mapApplication(application));
  } catch (err) {
    next(err);
  }
};

exports.getApplicationsByQuery = async (req, res, next) => {
  try {
    const { jobId } = req.query;
    if (!jobId) return res.status(400).json({ error: "jobId kerak" });

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({ error: "Bu ish sizga tegishli emas" });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: User,
          as: "seeker",
          attributes: ["id", "name", "email", "phone"],
          include: [{ model: JobSeekerProfile, as: "profile", attributes: ["skills", "cv_url"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(applications.map(mapApplication));
  } catch (err) {
    next(err);
  }
};

exports.setApplicationRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const application = await Application.findByPk(req.params.id, { include: [{ model: Job, as: "job" }] });
    if (!application) return res.status(404).json({ error: "Ariza topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== application.job.company_id) {
      return res.status(403).json({ error: "Bu ariza sizga tegishli emas" });
    }
    if (!role) return res.status(400).json({ error: "Rol kiritilmagan" });

    application.offered_role = role;
    await application.save();

    res.json(mapApplication(application));
  } catch (err) {
    next(err);
  }
};

exports.getWorkers = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.json({ count: 0, workers: [] });

    const jobs = await Job.findAll({ where: { company_id: company.id }, attributes: ["id"] });
    const ids = jobs.map((j) => j.id);
    if (!ids.length) return res.json({ count: 0, workers: [] });

    const applications = await Application.findAll({
      where: { job_id: { [Op.in]: ids }, status: { [Op.in]: ["accepted"] } },
      include: [
        {
          model: User,
          as: "seeker",
          attributes: ["id", "name", "email", "phone"],
          include: [{ model: JobSeekerProfile, as: "profile", attributes: ["skills"] }],
        },
        { model: Job, as: "job", attributes: ["id", "title"] },
      ],
      order: [["created_at", "DESC"]],
    });

    const bySeeker = new Map();
    for (const app of applications) {
      if (!app.seeker) continue;
      if (bySeeker.has(app.seeker.id)) continue;
      bySeeker.set(app.seeker.id, {
        id: app.seeker.id,
        name: app.seeker.name,
        email: app.seeker.email,
        phone: app.seeker.phone,
        skills: app.seeker.profile?.skills || [],
        role: app.offered_role || null,
        jobTitle: app.job?.title || null,
        hiredAt: app.created_at,
      });
    }

    const workers = [...bySeeker.values()];
    res.json({ count: workers.length, workers });
  } catch (err) {
    next(err);
  }
};

exports.setApplicationStatus = (status) => async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, { include: [{ model: Job, as: "job" }] });
    if (!application) return res.status(404).json({ error: "Ariza topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== application.job.company_id) {
      return res.status(403).json({ error: "Bu ariza sizga tegishli emas" });
    }

    application.status = status;
    await application.save();

    res.json(mapApplication(application));
  } catch (err) {
    next(err);
  }
};