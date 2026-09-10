const { Company, User } = require("../models");

exports.createCompany = async (req, res, next) => {
  try {
    const { name, industry, address, description } = req.body;

    const existing = await Company.findOne({ where: { owner_id: req.user.id } });
    if (existing) return res.status(400).json({ error: "Sizda allaqachon kompaniya mavjud" });

    const company = await Company.create({
      name, industry, address, description, owner_id: req.user.id,
    });

    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.findAll({ include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }] });
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }],
    });
    if (!company) return res.status(404).json({ error: "Kompaniya topilmadi" });
    res.json(company);
  } catch (err) {
    next(err);
  }
};
