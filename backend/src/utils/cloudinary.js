const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");
const { AppError } = require("./errors");
const { isDataImage } = require("./validators");

function getPublicIdFromUrl(url) {
    if (typeof url !== "string" || !url.includes("/upload/")) {
        return null;
    }

    const uploadPath = url.split("/upload/")[1];
    if (!uploadPath) {
        return null;
    }

    const pathWithoutVersion = uploadPath.replace(/^v\d+\//, "");
    const withoutExtension = pathWithoutVersion.replace(/\.[^.]+$/, "");
    return withoutExtension || null;
}

function uploadBuffer(buffer, options = {}) {
    if (!buffer) {
        throw new AppError("Image buffer is required.", 400);
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || "todo-list",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            },
        );

        Readable.from(buffer).pipe(stream);
    });
}

async function uploadDataUri(dataUri, options = {}) {
    if (!isDataImage(dataUri)) {
        throw new AppError("Invalid image data.", 400);
    }

    return cloudinary.uploader.upload(dataUri, {
        folder: options.folder || "todo-list",
        resource_type: "image",
    });
}

async function deleteImage(publicId) {
    if (!publicId) {
        return null;
    }

    return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

module.exports = {
    uploadBuffer,
    uploadDataUri,
    deleteImage,
    getPublicIdFromUrl,
};
