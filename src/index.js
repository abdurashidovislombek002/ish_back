require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Models (associations qo'llash uchun)
require("./models");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/companies", require("./routes/companies"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/companies", require("./routes/roles"));

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", message: "Ish qidirish platformasi API" }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL ga ulanildi");

    await sequelize.sync({ alter: true });
    console.log("Modellar sinc qilindi");

    app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));
  } catch (err) {
    console.error("Server xatosi:", err);
    process.exit(1);
  }
})();
