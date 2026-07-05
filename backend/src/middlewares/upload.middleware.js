const multer = require("multer");
const { AppError } = require("../utils/errors");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith("image/")) {
            cb(new AppError("Only image files are allowed.", 400), false);
            return;
        }

        cb(null, true);
    },
});

module.exports = {
    upload,
};
