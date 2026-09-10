const router = require("express").Router();
const { createCompany, getAllCompanies, getCompanyById } = require("../controllers/companyController");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.post("/", auth, requireRole("company_owner"), createCompany);

module.exports = router;
