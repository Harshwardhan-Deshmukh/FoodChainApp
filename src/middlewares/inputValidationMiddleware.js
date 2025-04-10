const { registrationZodSchema, loginZodSchema, updateUserDataZodSchema } = require("../validation/zodSchema");

function registrationInputValidation(req, res, next) {
    const { username, email, password, phone, address, userType } = req.body;
    const data = { username, email, password, phone, address, userType };
    const response = registrationZodSchema.safeParse(data);
    if (response.success) {
        req.data = response.data;
        next()
    } else {
        res.status(411).json({
            status: "INPUT_VALIDATION_FAILED",
            message: null,
            error: response.error.errors,
            timestamp: SERVER_TIMESTAMP,
        });
    }
}

function loginInputValidation(req, res, next) {
    const { email, password } = req.body;
    const data = { email, password };
    const response = loginZodSchema.safeParse(data);
    if (response.success) {
        req.data = response.data;
        next()
    } else {
        res.status(411).json({
            status: "INPUT_VALIDATION_FAILED",
            message: null,
            error: response.error.errors,
            timestamp: SERVER_TIMESTAMP,
        });
    }
}

function updateUserDataInputValidation(req, res, next) {
    const { username, password, phone, address, userType } = req.body;
    const data = { username, password, phone, address, userType };
    const response = updateUserDataZodSchema.safeParse(data);
    if (response.success) {
        req.data = response.data;
        next()
    } else {
        res.status(411).json({
            status: "INPUT_VALIDATION_FAILED",
            message: null,
            error: response.error.errors,
            timestamp: SERVER_TIMESTAMP,
        });
    }
}

module.exports = {
    registrationInputValidation,
    loginInputValidation,
    updateUserDataInputValidation
}