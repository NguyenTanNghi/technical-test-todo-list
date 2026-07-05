const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

router.use(protect);

router.post("/", upload.single("image"), uploadController.uploadImage);

module.exports = router;
