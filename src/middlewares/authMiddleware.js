const jwt = require("jsonwebtoken");
const { SERVER_TIMESTAMP, JWT_SECRET } = require("../config/configs");
const { User } = require("../models/db");
const { verifyPasswordHash } = require("../utils/passwordHasher");

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
            const { _id, email, userType } = userData;
            const token = jwt.sign({
                id: _id,
                email,
                userType
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
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({
            status: "AUTH_HEADER_NOT_FOUND",
            message: null,
            error: `Please add Authorization Header`,
            timestamp: SERVER_TIMESTAMP
        });
    }
    const [ type, token ] = authHeader.split(" "); // extract the token from headers
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
            error: `Invalid token type`,
            timestamp: SERVER_TIMESTAMP
        });
    }
}

module.exports = {
    doesUserExistsRegistration,
    doesUserExistsLogin,
    checkTokenValidity,
}