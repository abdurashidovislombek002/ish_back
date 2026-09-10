const router = require("express").Router();
const { createApplication, getMyApplications, getJobApplications, updateApplication } = require("../controllers/applicationController");
const { auth, requireRole } = require("../middleware/auth");

router.post("/", auth, requireRole("seeker"), createApplication);
router.get("/my", auth, requireRole("seeker"), getMyApplications);
router.get("/job/:jobId", auth, requireRole("company_owner"), getJobApplications);
router.put("/:id", auth, requireRole("company_owner"), updateApplication);

module.exports = router;
