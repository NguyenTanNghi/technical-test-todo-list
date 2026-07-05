const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("../utils/errors");
const { trimValue } = require("../utils/validators");
const { seedDefaultCategories } = require("./category.service");

function createToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );
}

function buildAuthResponse(user) {
    return {
        token: createToken(user),
        user: user.toJSON(),
    };
}

async function registerUser(payload) {
    const username = trimValue(payload.username).toLowerCase();
    const email = trimValue(payload.email).toLowerCase();

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new AppError("Username or email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
        firstName: trimValue(payload.firstName),
        lastName: trimValue(payload.lastName),
        username,
        email,
        passwordHash,
    });

    // Seed 6 default categories for this user
    await seedDefaultCategories(user._id);

    return buildAuthResponse(user);
}

async function loginUser(payload) {
    const identifier = trimValue(payload.username).toLowerCase();
    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select("+passwordHash");

    if (!user) {
        throw new AppError("Invalid username or password.", 401);
    }

    const isPasswordValid = await bcrypt.compare(
        payload.password,
        user.passwordHash,
    );
    if (!isPasswordValid) {
        throw new AppError("Invalid username or password.", 401);
    }

    return buildAuthResponse(user);
}

async function getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found.", 404);
    }

    return user.toJSON();
}

async function updateProfile(userId, payload) {
    const user = await User.findById(userId).select("+passwordHash");
    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const nextEmail =
        typeof payload.email === "string"
            ? trimValue(payload.email).toLowerCase()
            : user.email;
    if (nextEmail !== user.email) {
        const duplicate = await User.findOne({
            email: nextEmail,
            _id: { $ne: userId },
        });
        if (duplicate) {
            throw new AppError("Email already exists.", 409);
        }
    }

    if (typeof payload.firstName !== "undefined")
        user.firstName = trimValue(payload.firstName);
    if (typeof payload.lastName !== "undefined")
        user.lastName = trimValue(payload.lastName);
    if (typeof payload.email !== "undefined") user.email = nextEmail;
    if (typeof payload.contactNumber !== "undefined")
        user.contactNumber = trimValue(payload.contactNumber);
    if (typeof payload.position !== "undefined")
        user.position = trimValue(payload.position);

    await user.save();
    return user.toJSON();
}

async function logoutUser() {
    return { ok: true };
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,
};
