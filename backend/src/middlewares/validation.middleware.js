const { sendError } = require("../utils/response");

function validate(validator) {
    return (req, res, next) => {
        const errors = validator(req);

        if (errors && errors.length > 0) {
            return sendError(res, errors[0], 400, errors);
        }

        return next();
    };
}

module.exports = {
    validate,
};
