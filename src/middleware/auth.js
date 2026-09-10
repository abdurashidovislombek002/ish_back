const jwt = require("jsonwebtoken");
const { User } = require("../models");

const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token topilmadi" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(401).json({ error: "Foydalanuvchi topilmadi" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Noto'g'ri token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Ruxsat etilmagan" });
  }
  next();
};

module.exports = { auth, requireRole };
