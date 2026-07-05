const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError, asyncHandler } = require("../utils/errors");

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        throw new AppError("Not authorized. Please sign in again.", 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new AppError("Not authorized. Please sign in again.", 401);
    }

    const user = await User.findById(
        decoded.sub || decoded.id || decoded.userId,
    );
    if (!user) {
        throw new AppError("Not authorized. Please sign in again.", 401);
    }

    req.user = user;
    next();
});

module.exports = {
    protect,
};
