const Task = require("../models/Task");
const { AppError } = require("../utils/errors");
const {
    trimValue,
    escapeRegExp,
    isValidObjectId,
} = require("../utils/validators");
const {
    uploadImageFromFile,
    uploadImageFromValue,
    deleteUploadedImage,
} = require("./upload.service");

function buildTaskFilter(userId, query) {
    const filter = { userId };

    const search = trimValue(query.search);
    if (search) {
        const pattern = new RegExp(escapeRegExp(search), "i");
        filter.$or = [{ title: pattern }, { description: pattern }];
    }

    if (query.status) {
        filter.status = trimValue(query.status);
    }

    if (query.priority) {
        filter.priority = trimValue(query.priority);
    }

    return filter;
}

function normalizeTaskPayload(payload) {
    const normalized = {};

    if (typeof payload.title !== "undefined")
        normalized.title = trimValue(payload.title);
    if (typeof payload.description !== "undefined")
        normalized.description = trimValue(payload.description);
    if (typeof payload.priority !== "undefined")
        normalized.priority = trimValue(payload.priority);
    if (typeof payload.status !== "undefined")
        normalized.status = trimValue(payload.status);
    if (typeof payload.categoryId !== "undefined")
        normalized.categoryId = trimValue(payload.categoryId);
    if (typeof payload.date !== "undefined" && trimValue(payload.date))
        normalized.date = new Date(trimValue(payload.date));
    if (typeof payload.image !== "undefined") normalized.image = payload.image;

    return normalized;
}

async function resolveTaskImage({ file, imageValue, currentTask }) {
    if (file) {
        return uploadImageFromFile(file);
    }

    if (typeof imageValue !== "undefined") {
        const trimmedImage =
            typeof imageValue === "string" ? imageValue.trim() : imageValue;

        if (!trimmedImage) {
            return { url: "", publicId: "" };
        }

        if (currentTask && trimmedImage === currentTask.image) {
            return {
                url: currentTask.image,
                publicId: currentTask.imagePublicId || "",
            };
        }

        return uploadImageFromValue(trimmedImage);
    }

    if (currentTask) {
        return {
            url: currentTask.image || "",
            publicId: currentTask.imagePublicId || "",
        };
    }

    return { url: "", publicId: "" };
}

async function createTask(userId, payload, file) {
    const normalized = normalizeTaskPayload(payload);
    const imageInput =
        typeof normalized.image !== "undefined"
            ? normalized.image
            : payload.image;
    const imageAsset = await resolveTaskImage({ file, imageValue: imageInput });

    let createdTask;
    try {
        createdTask = await Task.create({
            userId,
            title: normalized.title,
            description: normalized.description || "",
            priority: normalized.priority || "Moderate",
            status: normalized.status || "Not Started",
            date: normalized.date,
            image: imageAsset.url,
            imagePublicId: imageAsset.publicId,
            categoryId: normalized.categoryId || "",
        });
    } catch (error) {
        if (imageAsset.publicId) {
            await deleteUploadedImage(imageAsset.publicId).catch(() => {});
        }
        throw error;
    }

    return createdTask;
}

async function getTasks(userId, query) {
    const filter = buildTaskFilter(userId, query);

    const hasPagination =
        typeof query.page !== "undefined" || typeof query.limit !== "undefined";
    const total = await Task.countDocuments(filter);

    const page = Math.max(Number(query.page) || 1, 1);
    const limit = hasPagination
        ? Math.min(Math.max(Number(query.limit) || 20, 1), 100)
        : Math.max(total, 1);
    const skip = hasPagination ? (page - 1) * limit : 0;

    const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        tasks,
        meta: {
            total,
            page,
            limit,
            totalPages: hasPagination ? Math.ceil(total / limit) || 1 : 1,
        },
    };
}

async function getTaskById(userId, taskId) {
    if (!isValidObjectId(taskId)) {
        throw new AppError("Invalid task identifier.", 400);
    }

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
        throw new AppError("Task not found.", 404);
    }

    return task;
}

async function updateTask(userId, taskId, payload, file) {
    const task = await getTaskById(userId, taskId);
    const normalized = normalizeTaskPayload(payload);

    const hasImageInput =
        typeof normalized.image !== "undefined" || Boolean(file);
    const nextImageAsset = hasImageInput
        ? await resolveTaskImage({
              file,
              imageValue: normalized.image,
              currentTask: task,
          })
        : {
              url: task.image || "",
              publicId: task.imagePublicId || "",
          };

    const previousPublicId = task.imagePublicId;
    const previousImage = task.image;

    if (typeof normalized.title !== "undefined") task.title = normalized.title;
    if (typeof normalized.description !== "undefined")
        task.description = normalized.description;
    if (typeof normalized.priority !== "undefined")
        task.priority = normalized.priority;
    if (typeof normalized.status !== "undefined")
        task.status = normalized.status;
    if (typeof normalized.categoryId !== "undefined")
        task.categoryId = normalized.categoryId;
    if (typeof normalized.date !== "undefined") task.date = normalized.date;

    if (hasImageInput) {
        task.image = nextImageAsset.url;
        task.imagePublicId = nextImageAsset.publicId;
    } else {
        task.image = previousImage;
        task.imagePublicId = previousPublicId;
    }

    try {
        await task.save();
    } catch (error) {
        if (
            hasImageInput &&
            nextImageAsset.publicId &&
            nextImageAsset.publicId !== previousPublicId
        ) {
            await deleteUploadedImage(nextImageAsset.publicId).catch(() => {});
        }
        throw error;
    }

    if (
        hasImageInput &&
        previousPublicId &&
        previousPublicId !== task.imagePublicId
    ) {
        await deleteUploadedImage(previousPublicId).catch(() => {});
    }

    return task;
}

async function deleteTask(userId, taskId) {
    const task = await getTaskById(userId, taskId);
    await task.deleteOne();

    if (task.imagePublicId) {
        await deleteUploadedImage(task.imagePublicId).catch(() => {});
    }

    return { deleted: true };
}

async function getTaskStats(userId) {
    const tasks = await Task.find({ userId });
    const total = tasks.length;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    for (const t of tasks) {
        const s = (t.status || "").toLowerCase();
        if (s.includes("complete") || s.includes("done") || s.includes("finish") || s.includes("hoàn thành")) {
            completed++;
        } else if (s.includes("progress") || s.includes("active") || s.includes("doing") || s.includes("tiến hành")) {
            inProgress++;
        } else {
            notStarted++;
        }
    }

    return {
        completed,
        inProgress,
        notStarted,
        total,
        completedPercent: total ? Math.round((completed / total) * 100) : 0,
        inProgressPercent: total ? Math.round((inProgress / total) * 100) : 0,
        notStartedPercent: total ? Math.round((notStarted / total) * 100) : 0,
    };
}

async function uploadTaskImage(userId, taskId, file) {
    const task = await getTaskById(userId, taskId);
    const imageAsset = await uploadImageFromFile(file);
    const previousPublicId = task.imagePublicId;

    task.image = imageAsset.url;
    task.imagePublicId = imageAsset.publicId;
    await task.save();

    if (previousPublicId && previousPublicId !== imageAsset.publicId) {
        await deleteUploadedImage(previousPublicId).catch(() => {});
    }

    return task;
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats,
    uploadTaskImage,
};
