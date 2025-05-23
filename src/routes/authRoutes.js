const { Router } = require("express");
const { User } = require("../models/db");
const { doesUserExistsLogin, doesUserExistsRegistration } = require("../middlewares/authMiddleware");
const { hashPassword } = require("../utils/passwordHasher");
const { SERVER_TIMESTAMP } = require("../config/configs");
const { registrationInputValidation, loginInputValidation } = require("../middlewares/inputValidationMiddleware");
const router = Router();

router.post("/register", registrationInputValidation, doesUserExistsRegistration, async (req, res) => {

    const { username, email, password, phone, address, userType } = req.data;
    const hashedPassword = hashPassword(password);
    await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
        address,
        userType
    });

    res.status(201).json({
        status: "SUCCESS",
        message: "User Created Successfully",
        error: null,
        timestamp: SERVER_TIMESTAMP,
    });

})

router.post("/login", loginInputValidation, doesUserExistsLogin, async (req, res) => {
    const token = req.token;
    if (token) {
        res.status(200).json({
            status: "LOGIN_SUCCESS",
            message: {
                token
            },
            error: null,
            timestamp: SERVER_TIMESTAMP
        })
    } else {
        res.status(401).json({
            status: "AUTHENTICATION_FAILED",
            message: null,
            error: "Invalid Password",
            timestamp: SERVER_TIMESTAMP
        });
    }
})

module.exports = router;