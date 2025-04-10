const jwt = require("jsonwebtoken");
const { registrationZodSchema, loginZodSchema } = require("../validation/zodSchema");
const { SERVER_TIMESTAMP, JWT_SECRET } = require("../config/configs");
const { User } = require("../models/db");
const { hashPassword, verifyPasswordHash } = require("../utils/passwordHasher");

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

async function doesUserExistsRegistration(req, res, next) {
    const { email } = req.body;
    const userData = await User.findOne({ email });

    // response for /register route
    if (userData) {
        res.status(409).json({
            status: "USER_ALREADY_EXISTS",
            message: null,
            error: `Please login using you registered email address`,
            timestamp: SERVER_TIMESTAMP,
        });
    } else {
        // continue with registration process
        next();
    }
}

async function doesUserExistsLogin(req, res, next) {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    console.log(userData)
    // response for login route
    if (userData) {
        const passwordHash = userData.password;
        const isPasswordValid = verifyPasswordHash(password, passwordHash);
        console.log(isPasswordValid)
        if (isPasswordValid) {
            const { username, email, userType } = userData;
            const token = jwt.sign({
                username,
                email,
                userType
            }, JWT_SECRET, { expiresIn: "1h" });
            req.token = token;
        }
        next();
    } else {
        res.status(404).json({
            status: "USER_NOT_FOUND",
            message: null,
            error: `Please Register using a valid email address`,
            timestamp: SERVER_TIMESTAMP,
        });
    }
}


module.exports = {
    registrationInputValidation,
    loginInputValidation,
    doesUserExistsRegistration,
    doesUserExistsLogin
}