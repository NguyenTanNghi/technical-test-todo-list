const Category = require("../models/Category");
const { AppError } = require("../utils/errors");
const {
    trimValue,
    isValidObjectId,
    CATEGORY_TYPES,
} = require("../utils/validators");

const DEFAULT_CATEGORY_NAMES = {
    status: ["Completed", "In Progress", "Not Started"],
    priority: ["Extreme", "Moderate", "Low"],
};

function normalizeType(type) {
    const normalized = trimValue(type).toLowerCase();
    if (!CATEGORY_TYPES.includes(normalized)) {
        throw new AppError("Category type is invalid.", 400);
    }
    return normalized;
}

function normalizeName(name) {
    return trimValue(name);
}

async function seedDefaultCategories(userId) {
    const total = await Category.countDocuments({ userId });
    if (total > 0) return;

    const defaults = CATEGORY_TYPES.flatMap((type) =>
        DEFAULT_CATEGORY_NAMES[type].map((name) => ({
            userId,
            type,
            name,
        })),
    );

    if (defaults.length > 0) {
        await Category.insertMany(defaults, { ordered: true });
    }
}

async function getCategories(userId) {
    await seedDefaultCategories(userId);

    const categories = await Category.find({ userId }).sort({
        type: 1,
        createdAt: 1,
    });

    return {
        statuses: categories.filter((category) => category.type === "status"),
        priorities: categories.filter(
            (category) => category.type === "priority",
        ),
    };
}

async function createCategory(userId, payload) {
    const type = normalizeType(payload.type);
    const name = normalizeName(payload.name);

    if (!name) {
        throw new AppError("Category name is required.", 400);
    }

    const existing = await Category.findOne({ userId, type, name });
    if (existing) {
        throw new AppError("Category already exists.", 409);
    }

    return Category.create({ userId, type, name });
}

async function updateCategory(userId, categoryId, payload) {
    if (!isValidObjectId(categoryId)) {
        throw new AppError("Invalid category identifier.", 400);
    }

    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    if (typeof payload.name !== "undefined") {
        const name = normalizeName(payload.name);
        if (!name) {
            throw new AppError("Category name is required.", 400);
        }

        const duplicate = await Category.findOne({
            userId,
            type: category.type,
            name,
            _id: { $ne: categoryId },
        });
        if (duplicate) {
            throw new AppError("Category already exists.", 409);
        }

        category.name = name;
    }

    await category.save();
    return category;
}

async function deleteCategory(userId, categoryId) {
    if (!isValidObjectId(categoryId)) {
        throw new AppError("Invalid category identifier.", 400);
    }

    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    await category.deleteOne();
    return { deleted: true };
}

module.exports = {
    seedDefaultCategories,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
