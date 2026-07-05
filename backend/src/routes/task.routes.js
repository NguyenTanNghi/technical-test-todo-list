const express = require("express");
const taskController = require("../controllers/task.controller");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { validateTaskBody, validateTaskQuery } = require("../utils/validators");

const router = express.Router();

router.use(protect);

router.get("/stats", taskController.getTaskStats);

router.get(
    "/",
    validate((req) => validateTaskQuery(req.query)),
    taskController.getTasks,
);

router.get("/:id", taskController.getTaskById);

router.post(
    "/",
    upload.single("image"),
    validate((req) => validateTaskBody(req.body, { partial: false })),
    taskController.createTask,
);

router.put(
    "/:id",
    upload.single("image"),
    validate((req) => validateTaskBody(req.body, { partial: true })),
    taskController.updateTask,
);

router.delete("/:id", taskController.deleteTask);

router.post(
    "/:id/image",
    upload.single("image"),
    taskController.uploadTaskImage,
);

module.exports = router;
