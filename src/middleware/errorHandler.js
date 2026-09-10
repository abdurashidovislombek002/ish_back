const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ error: "Validatsiya xatosi", details: messages });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Bu ma'lumot allaqachon mavjud" });
  }

  res.status(err.statusCode || 500).json({ error: err.message || "Server xatosi" });
};

module.exports = errorHandler;
