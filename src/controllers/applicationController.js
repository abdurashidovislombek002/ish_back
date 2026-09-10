const { Application, Job, Company, User } = require("../models");

exports.createApplication = async (req, res, next) => {
  try {
    const { job_id, message } = req.body;

    const job = await Job.findByPk(job_id);
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });
    if (job.status !== "active") return res.status(400).json({ error: "Bu ish yopilgan" });

    const existing = await Application.findOne({ where: { job_id, seeker_id: req.user.id } });
    if (existing) return res.status(400).json({ error: "Siz allaqachon ariza bergansiz" });

    const application = await Application.create({ job_id, seeker_id: req.user.id, message });
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { seeker_id: req.user.id },
      include: [{ model: Job, as: "job", include: [{ model: Company, as: "company", attributes: ["id", "name"] }] }],
      order: [["created_at", "DESC"]],
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({ error: "Bu ish sizga tegishli emas" });
    }

    const applications = await Application.findAll({
      where: { job_id: req.params.jobId },
      include: [{ model: User, as: "seeker", attributes: ["id", "name", "email", "phone"] }],
      order: [["created_at", "DESC"]],
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: "job" }],
    });
    if (!application) return res.status(404).json({ error: "Ariza topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== application.job.company_id) {
      return res.status(403).json({ error: "Bu ariza sizga tegishli emas" });
    }

    const { status, offered_role } = req.body;
    if (status) application.status = status;
    if (offered_role) application.offered_role = offered_role;
    await application.save();

    res.json(application);
  } catch (err) {
    next(err);
  }
};
