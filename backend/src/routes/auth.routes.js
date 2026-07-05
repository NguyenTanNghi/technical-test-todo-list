const express = require("express");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
    validateRegisterBody,
    validateLoginBody,
    validateUpdateProfileBody,
} = require("../utils/validators");

const router = express.Router();

router.post(
    "/register",
    validate((req) => validateRegisterBody(req.body)),
    authController.register,
);
router.post(
    "/login",
    validate((req) => validateLoginBody(req.body)),
    authController.login,
);
router.post("/logout", authController.logout);
router.get("/profile", protect, authController.profile);
router.put(
    "/profile",
    protect,
    validate((req) => validateUpdateProfileBody(req.body)),
    authController.updateProfile,
);

module.exports = router;
