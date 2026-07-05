const authService = require("../services/auth.service");
const { asyncHandler } = require("../utils/errors");
const { sendSuccess } = require("../utils/response");

const register = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, "User registered successfully.", result, 201);
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, "Login successful.", result);
});

const logout = asyncHandler(async (req, res) => {
    await authService.logoutUser();
    return sendSuccess(res, "Logout successful.", { ok: true });
});

const profile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    return sendSuccess(res, "Profile loaded successfully.", user);
});

const updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user._id, req.body);
    return sendSuccess(res, "Profile updated successfully.", user);
});

module.exports = {
    register,
    login,
    logout,
    profile,
    updateProfile,
};
