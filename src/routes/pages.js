const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { auth, requireRole } = require("../middleware/auth");
const {
  getCategories,
  getLocations,
  getMyJobs,
  getMyRoles,
  getMyApplications,
  createApplicationForm,
  getApplicationsByQuery,
  setApplicationRole,
  setApplicationStatus,
} = require("../controllers/pageController");

router.get("/categories", getCategories);
router.get("/locations", getLocations);

router.get("/my-jobs", auth, requireRole("company_owner"), getMyJobs);
router.get("/roles", auth, requireRole("company_owner"), getMyRoles);

router.get("/my-applications", auth, requireRole("seeker"), getMyApplications);
router.post("/apply", auth, requireRole("seeker"), upload.single("cv"), createApplicationForm);

router.get("/applications", auth, requireRole("company_owner"), getApplicationsByQuery);
router.post("/applications/:id/role", auth, requireRole("company_owner"), setApplicationRole);
router.post("/applications/:id/accept", auth, requireRole("company_owner"), setApplicationStatus("accepted"));
router.post("/applications/:id/reject", auth, requireRole("company_owner"), setApplicationStatus("rejected"));

module.exports = router;