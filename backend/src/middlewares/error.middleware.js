const multer = require("multer");
const mongoose = require("mongoose");
const { sendError } = require("../utils/response");
const { AppError } = require("../utils/errors");

function errorHandler(error, req, res, next) {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return sendError(res, "Image file size must be 5MB or less.", 400);
        }

        return sendError(res, error.message || "Upload failed.", 400);
    }

    if (error instanceof AppError) {
        return sendError(res, error.message, error.statusCode || 500);
    }

    if (error.name === "CastError" && error.kind === "ObjectId") {
        return sendError(res, "Invalid identifier.", 400);
    }

    if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map(
            (item) => item.message,
        );
        return sendError(
            res,
            messages[0] || "Validation failed.",
            400,
            messages,
        );
    }

    if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue || {})[0] || "field";
        return sendError(res, `${duplicateField} already exists.`, 409);
    }

    if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
    ) {
        return sendError(res, "Not authorized. Please sign in again.", 401);
    }

    const message = error.message || "Something went wrong.";
    return sendError(res, message, 500);
}

module.exports = {
    errorHandler,
};
