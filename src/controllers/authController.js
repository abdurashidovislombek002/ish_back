  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const { User, Company, JobSeekerProfile } = require("../models");

  const generateToken = (user) =>
    jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  exports.register = async (req, res, next) => {
    try {
      const { name, email, password, role, phone, company, companyId, skills } = req.body;

      if (!["seeker", "company_owner"].includes(role)) {
        return res.status(400).json({ error: "Noto'g'ri role. 'seeker' yoki 'company_owner'" });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, role, phone });

      if (role === "seeker") {
        let parsedSkills = [];
        if (skills) {
          try { parsedSkills = JSON.parse(skills); } catch (_e) { parsedSkills = []; }
        }
        await JobSeekerProfile.create({
          user_id: user.id,
          skills: Array.isArray(parsedSkills) ? parsedSkills : [],
        });
      }

      if (role === "company_owner") {
        if (companyId) {
          const existing = await Company.findByPk(companyId);
          if (!existing) return res.status(400).json({ error: "Kompaniya topilmadi" });
          const alreadyOwned = await Company.findOne({ where: { owner_id: user.id } });
          if (alreadyOwned) return res.status(400).json({ error: "Sizda allaqachon kompaniya mavjud" });
          await existing.update({ owner_id: user.id });
        } else if (company?.name) {
          await Company.create({
            name: company.name,
            industry: company.industry || null,
            address: company.address || null,
            owner_id: user.id,
          });
        }
      }

      const token = generateToken(user);
      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      });
    } catch (err) {
      next(err);
    }
  };

  exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: "Email yoki parol noto'g'ri" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Email yoki parol noto'g'ri" });

      const token = generateToken(user);
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      });
    } catch (err) {
      next(err);
    }
  };

  exports.me = async (req, res) => {
    const data = { ...req.user.toJSON() };

    if (req.user.role === "company_owner") {
      data.company = await Company.findOne({ where: { owner_id: req.user.id } });
    } else {
      data.profile = await JobSeekerProfile.findOne({ where: { user_id: req.user.id } });
    }

    res.json(data);
  };
