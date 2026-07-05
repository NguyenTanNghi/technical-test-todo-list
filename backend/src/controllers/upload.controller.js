const { asyncHandler } = require("../utils/errors");
const { sendSuccess } = require("../utils/response");
const { uploadImageFromFile } = require("../services/upload.service");

const uploadImage = asyncHandler(async (req, res) => {
    const image = await uploadImageFromFile(req.file);
    return sendSuccess(res, "Image uploaded successfully.", image, 201);
});

module.exports = {
    uploadImage,
};
