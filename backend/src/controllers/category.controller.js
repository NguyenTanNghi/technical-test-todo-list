const categoryService = require("../services/category.service");
const { asyncHandler } = require("../utils/errors");
const { sendSuccess } = require("../utils/response");

const getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories(req.user._id);
    return sendSuccess(res, "Categories loaded successfully.", categories);
});

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(
        req.user._id,
        req.body,
    );
    return sendSuccess(res, "Category created successfully.", category, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(
        req.user._id,
        req.params.id,
        req.body,
    );
    return sendSuccess(res, "Category updated successfully.", category);
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.user._id, req.params.id);
    return sendSuccess(res, "Category deleted successfully.", {
        deleted: true,
    });
});

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
