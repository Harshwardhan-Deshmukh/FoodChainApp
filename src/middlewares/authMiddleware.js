const zod = require("zod");
const { registrationZodSchema } = require("../validation/zodSchema");
const { SERVER_TIMESTAMP } = require("../config/configs");
const { User } = require("../models/db");

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
            timestamp: SERVER_TIMESTAMP.toISOString(),
        });
    }
}

async function doesUserExists(req, res, next) {
    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (userData) {
        res.status(409).json({
            status: "USER_ALREADY_EXISTS",
            message: null,
            error: `Please login using you registered email address.`,
            timestamp: SERVER_TIMESTAMP.toISOString(),
        });
    } else {
        next();
    }
}

module.exports = {
    registrationInputValidation,
    doesUserExists
}