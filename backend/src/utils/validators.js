const PRIORITIES = ["Extreme", "Moderate", "Low"];
const STATUSES = ["Not Started", "In Progress", "Completed"];
const CATEGORY_TYPES = ["status", "priority"];

function trimValue(value) {
    return typeof value === "string" ? value.trim() : "";
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimValue(value));
}

function isValidObjectId(value) {
    return /^[0-9a-fA-F]{24}$/.test(String(value || ""));
}

function isValidPriority(value) {
    return PRIORITIES.includes(value);
}

function isValidStatus(value) {
    return STATUSES.includes(value);
}

function isDataImage(value) {
    return (
        typeof value === "string" &&
        /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value)
    );
}

function isCloudinaryUrl(value) {
    return (
        typeof value === "string" &&
        /^https?:\/\/(res\.cloudinary\.com|cloudinary\.com)\//.test(value)
    );
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateRegisterBody(body) {
    const errors = [];

    if (!isNonEmptyString(body.firstName))
        errors.push("First name is required.");
    if (!isNonEmptyString(body.lastName)) errors.push("Last name is required.");
    if (!isNonEmptyString(body.username)) errors.push("Username is required.");
    if (!isNonEmptyString(body.email)) errors.push("Email is required.");
    else if (!isValidEmail(body.email)) errors.push("Email is invalid.");
    if (!isNonEmptyString(body.password)) errors.push("Password is required.");
    else if (trimValue(body.password).length < 6)
        errors.push("Password must be at least 6 characters.");
    if (trimValue(body.password) !== trimValue(body.confirmPassword)) {
        errors.push("Passwords do not match.");
    }

    return errors;
}

function validateLoginBody(body) {
    const errors = [];

    if (!isNonEmptyString(body.username)) errors.push("Username is required.");
    if (!isNonEmptyString(body.password)) errors.push("Password is required.");

    return errors;
}

function validateUpdateProfileBody(body) {
    const errors = [];

    ["firstName", "lastName", "email", "contactNumber", "position"].forEach(
        (field) => {
            if (
                typeof body[field] !== "undefined" &&
                !isNonEmptyString(body[field])
            ) {
                errors.push(`${field} cannot be empty.`);
            }
        },
    );

    if (typeof body.email !== "undefined" && !isValidEmail(body.email)) {
        errors.push("Email is invalid.");
    }

    return errors;
}

function validateTaskBody(body, { partial = false } = {}) {
    const errors = [];
    const title = trimValue(body.title);
    const priority = trimValue(body.priority);
    const status = trimValue(body.status);
    const date = trimValue(body.date);
    const categoryId = trimValue(body.categoryId);
    const image =
        typeof body.image === "string" ? body.image.trim() : body.image;

    if (!partial || typeof body.title !== "undefined") {
        if (!title) errors.push("Title is required.");
    }

    if (!partial || typeof body.priority !== "undefined") {
        if (!priority) errors.push("Priority is required.");
    }

    if (!partial || typeof body.status !== "undefined") {
        if (!status) errors.push("Status is required.");
    }

    if (!partial || typeof body.date !== "undefined") {
        if (!date) {
            errors.push("Date is required.");
        } else if (Number.isNaN(Date.parse(date))) {
            errors.push("Date is invalid.");
        } else {
            const selected = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const compareDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
            if (compareDate < today) {
                errors.push("Date cannot be in the past.");
            }
        }
    } else if (
        typeof body.date !== "undefined" &&
        date
    ) {
        if (Number.isNaN(Date.parse(date))) {
            errors.push("Date is invalid.");
        } else {
            const selected = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const compareDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
            if (compareDate < today) {
                errors.push("Date cannot be in the past.");
            }
        }
    }

    if (!partial || typeof body.description !== "undefined") {
        if (!trimValue(body.description)) errors.push("Description is required.");
    }

    if (
        typeof body.categoryId !== "undefined" &&
        categoryId &&
        !isNonEmptyString(categoryId)
    ) {
        errors.push("Category ID is invalid.");
    }

    if (
        typeof image !== "undefined" &&
        image &&
        !isDataImage(image) &&
        !isCloudinaryUrl(image) &&
        !/^https?:\/\//.test(image)
    ) {
        errors.push("Image must be a valid image data URI or URL.");
    }

    return errors;
}

function validateTaskQuery(query) {
    const errors = [];

    if (typeof query.page !== "undefined") {
        const page = Number(query.page);
        if (!Number.isInteger(page) || page < 1) {
            errors.push("Page must be a positive integer.");
        }
    }

    if (typeof query.limit !== "undefined") {
        const limit = Number(query.limit);
        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            errors.push("Limit must be between 1 and 100.");
        }
    }

    return errors;
}

function validateCategoryBody(body, { partial = false } = {}) {
    const errors = [];
    const type = trimValue(body.type).toLowerCase();
    const name = trimValue(body.name);

    if (!partial || typeof body.type !== "undefined") {
        if (!type) {
            errors.push("Category type is required.");
        } else if (!CATEGORY_TYPES.includes(type)) {
            errors.push("Category type is invalid.");
        }
    }

    if (!partial || typeof body.name !== "undefined") {
        if (!name) {
            errors.push("Category name is required.");
        }
    }

    return errors;
}

module.exports = {
    PRIORITIES,
    STATUSES,
    CATEGORY_TYPES,
    trimValue,
    isValidEmail,
    isValidObjectId,
    isValidPriority,
    isValidStatus,
    isDataImage,
    isCloudinaryUrl,
    escapeRegExp,
    validateRegisterBody,
    validateLoginBody,
    validateUpdateProfileBody,
    validateTaskBody,
    validateTaskQuery,
    validateCategoryBody,
};
