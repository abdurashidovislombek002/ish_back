const { Op } = require("sequelize");
const { Job, Company } = require("../models");
const { mapJob } = require("../utils/serialize");

exports.getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, category } = req.query;
    const where = { status: "active" };

    if (keyword) where.title = { [Op.iLike]: `%${keyword}%` };
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (category) where.category = { [Op.iLike]: `%${category}%` };

    const jobs = await Job.findAll({
      where,
      include: [{ model: Company, as: "company", attributes: ["id", "name", "industry"] }],
      order: [["created_at", "DESC"]],
    });

    res.json(jobs.map(mapJob));
  } catch (err) {
    next(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.status(400).json({ error: "Avval kompaniya yarating" });

    const { title, description, requirements, salary_min, salary_max, location, category, salaryMin, salaryMax } = req.body;

    const job = await Job.create({
      title, description, requirements,
      salary_min: salaryMin ?? salary_min ?? null,
      salary_max: salaryMax ?? salary_max ?? null,
      location, category,
      company_id: company.id,
    });

    res.status(201).json(mapJob(job));
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: Company, as: "company", attributes: ["id", "name", "industry", "address"] }],
    });
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });
    res.json(mapJob(job));
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({ error: "Bu ish sizga tegishli emas" });
    }

    const data = {
      ...req.body,
      salary_min: req.body.salaryMin ?? req.body.salary_min ?? undefined,
      salary_max: req.body.salaryMax ?? req.body.salary_max ?? undefined,
    };

    await job.update(data);
    res.json(mapJob(job));
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Ish topilmadi" });

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || company.id !== job.company_id) {
      return res.status(403).json({ error: "Bu ish sizga tegishli emas" });
    }

    await job.destroy();
    res.json({ message: "Ish o'chirildi" });
  } catch (err) {
    next(err);
  }
};
