const express = require("express");
const categoryController = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { validateCategoryBody } = require("../utils/validators");

const router = express.Router();

router.use(protect);

router.get("/", categoryController.getCategories);

router.post(
    "/",
    validate((req) => validateCategoryBody(req.body, { partial: false })),
    categoryController.createCategory,
);

router.patch(
    "/:id",
    validate((req) => validateCategoryBody(req.body, { partial: true })),
    categoryController.updateCategory,
);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
