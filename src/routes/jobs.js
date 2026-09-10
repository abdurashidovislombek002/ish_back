const router = require("express").Router();
const { getAllJobs, createJob, getJobById, updateJob, deleteJob } = require("../controllers/jobController");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", auth, requireRole("company_owner"), createJob);
router.put("/:id", auth, requireRole("company_owner"), updateJob);
router.delete("/:id", auth, requireRole("company_owner"), deleteJob);

module.exports = router;
