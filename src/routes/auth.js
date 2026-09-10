const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { register, login, me } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

router.post("/register", upload.single("cv"), register);
router.post("/login", login);
router.get("/me", auth, me);

module.exports = router;