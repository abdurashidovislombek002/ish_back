const { Role, Company } = require("../models");

exports.getRoles = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: "Kompaniya topilmadi" });

    let roles = await Role.findAll({ where: { company_id: req.params.id } });

    if (roles.length === 0) {
      const defaultRoles = ["Admin", "Ishchi", "Yordamchi", "Uborshik"];
      await Role.bulkCreate(defaultRoles.map((name) => ({ name, company_id: company.id })));
      roles = await Role.findAll({ where: { company_id: req.params.id } });
    }

    res.json(roles);
  } catch (err) {
    next(err);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: "Kompaniya topilmadi" });

    if (company.owner_id !== req.user.id) {
      return res.status(403).json({ error: "Faqat kompaniya egasi rol qo'sha oladi" });
    }

    const { name, description } = req.body;
    const role = await Role.create({ name, description, company_id: company.id });
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
};
