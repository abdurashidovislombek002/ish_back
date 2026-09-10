const router = require("express").Router();
const { getRoles, createRole } = require("../controllers/roleController");
const { auth, requireRole } = require("../middleware/auth");

router.get("/:id/roles", getRoles);
router.post("/:id/roles", auth, requireRole("company_owner"), createRole);

module.exports = router;
