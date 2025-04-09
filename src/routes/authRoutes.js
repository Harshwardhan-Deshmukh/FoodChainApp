const { Router } = require("express");
const { User } = require("../models/db");
const { registrationInputValidation, doesUserExists } = require("../middlewares/authMiddleware");
const { hashPassword } = require("../utils/passwordHasher");
const { SERVER_TIMESTAMP } = require("../config/configs");
const router = Router();

router.post("/register", registrationInputValidation, doesUserExists, async (req, res) => {
    const { username, email, password, phone, address, userType } = req.data;
    const hashedPassword = hashPassword(password);
    await User.create({ username, email, password: hashedPassword, phone, address, userType });
    res.status(201).json({
        status: "SUCCESS",
        message: "User Created Successfully",
        error: null,
        timestamp: SERVER_TIMESTAMP.toISOString(),
    });
})

module.exports = router;