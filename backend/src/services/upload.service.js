const { AppError } = require("../utils/errors");
const {
    uploadBuffer,
    uploadDataUri,
    deleteImage,
    getPublicIdFromUrl,
} = require("../utils/cloudinary");
const { isDataImage, isCloudinaryUrl } = require("../utils/validators");

async function uploadImageFromFile(file) {
    if (!file) {
        throw new AppError("Image file is required.", 400);
    }

    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
        throw new AppError("Only image files are allowed.", 400);
    }

    const result = await uploadBuffer(file.buffer, { folder: "todo-list" });
    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
}

async function uploadImageFromValue(value) {
    if (!value) {
        throw new AppError("Image is required.", 400);
    }

    if (isDataImage(value)) {
        const result = await uploadDataUri(value, { folder: "todo-list" });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }

    if (isCloudinaryUrl(value) || /^https?:\/\//.test(value)) {
        return {
            url: value,
            publicId: getPublicIdFromUrl(value),
        };
    }

    throw new AppError("Invalid image value.", 400);
}

async function deleteUploadedImage(publicId) {
    if (!publicId) {
        return null;
    }

    return deleteImage(publicId);
}

module.exports = {
    uploadImageFromFile,
    uploadImageFromValue,
    deleteUploadedImage,
};
