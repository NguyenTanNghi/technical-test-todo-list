const taskService = require("../services/task.service");
const { asyncHandler } = require("../utils/errors");
const { sendSuccess } = require("../utils/response");

const getTasks = asyncHandler(async (req, res) => {
    const result = await taskService.getTasks(req.user._id, req.query);
    return sendSuccess(res, "Tasks loaded successfully.", result);
});

const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.user._id, req.params.id);
    return sendSuccess(res, "Task loaded successfully.", task);
});

const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.user._id, req.body, req.file);
    return sendSuccess(res, "Task created successfully.", task, 201);
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(
        req.user._id,
        req.params.id,
        req.body,
        req.file,
    );
    return sendSuccess(res, "Task updated successfully.", task);
});

const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.user._id, req.params.id);
    return sendSuccess(res, "Task deleted successfully.", { deleted: true });
});

const getTaskStats = asyncHandler(async (req, res) => {
    const stats = await taskService.getTaskStats(req.user._id);
    return sendSuccess(res, "Task statistics loaded successfully.", stats);
});

const uploadTaskImage = asyncHandler(async (req, res) => {
    const task = await taskService.uploadTaskImage(
        req.user._id,
        req.params.id,
        req.file,
    );
    return sendSuccess(res, "Image uploaded successfully.", {
        url: task.image,
        publicId: task.imagePublicId,
        task,
    });
});

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    uploadTaskImage,
};
