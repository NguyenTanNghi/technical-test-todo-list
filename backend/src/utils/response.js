function buildSuccessPayload(message, data) {
    const payload = {
        success: true,
        message,
    };

    if (typeof data !== "undefined") {
        payload.data = data;

        if (data && typeof data === "object" && !Array.isArray(data)) {
            Object.assign(payload, data);
        }
    }

    return payload;
}

function sendSuccess(res, message = "Success", data, statusCode = 200) {
    return res.status(statusCode).json(buildSuccessPayload(message, data));
}

function sendError(
    res,
    message = "Something went wrong.",
    statusCode = 500,
    errors,
) {
    const payload = {
        success: false,
        message,
    };

    if (errors) {
        payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
}

module.exports = {
    sendSuccess,
    sendError,
};
