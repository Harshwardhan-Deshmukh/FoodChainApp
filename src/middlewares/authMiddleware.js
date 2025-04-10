const jwt = require("jsonwebtoken");
const { registrationZodSchema, loginZodSchema, updateUserDataZodSchema } = require("../validation/zodSchema");
const { SERVER_TIMESTAMP, JWT_SECRET } = require("../config/configs");
const { User } = require("../models/db");
const { verifyPasswordHash } = require("../utils/passwordHasher");

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

// returns a jwt token if valid password and email is received
async function doesUserExistsLogin(req, res, next) {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (userData) {
        const passwordHash = userData.password;
        const isPasswordValid = verifyPasswordHash(password, passwordHash);

        if (isPasswordValid) {
            const { _id, email } = userData;
            const token = jwt.sign({
                id: _id,
                email,
            }, JWT_SECRET, { expiresIn: "8h" });
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

function checkTokenValidity(req, res, next) {
    const [ type, token ] = req.headers["authorization"].split(" "); // extract the token from headers
    if (type === "Bearer") {
        try {
            const userData = jwt.verify(token, JWT_SECRET); // will throw error if token is not valid
            req.user = userData;
            next();
        } catch (err) {
            err.message = "Invalid Token"
            err.statusCode = 401
            throw err;
        }
    } else {
        res.status(401).json({
            status: "INVALID_TOKEN",
            message: null,
            error: `Invalid token type - ${type}`,
            timestamp: SERVER_TIMESTAMP
        });
    }
}

module.exports = {
    registrationInputValidation,
    loginInputValidation,
    doesUserExistsRegistration,
    doesUserExistsLogin,
    checkTokenValidity,
    updateUserDataInputValidation
}