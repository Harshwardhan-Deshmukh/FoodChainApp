const { Router } = require("express");
const { checkTokenValidity } = require("../middlewares/authMiddleware");
const { SERVER_TIMESTAMP } = require("../config/configs");
const { User } = require("../models/db");
const { hashPassword } = require("../utils/passwordHasher");
const { updateUserDataInputValidation } = require("../middlewares/inputValidationMiddleware");
const router = Router();

router.get("/", checkTokenValidity, async (req, res) => {
    const { id } = req.user;
    const data = await User.findById(id).select("username email address phone userType createdAt");
    if (data) {
        delete data._doc._id;
        res.status(200).json({
            status: "SUCCESS",
            message: { id, ...data["_doc"] },
            error: null,
            timestamp: SERVER_TIMESTAMP
        });
    } else {
        res.status(404).json({
            status: "USER_NOT_FOUND",
            message: null,
            error: `Please Register using a valid email address`,
            timestamp: SERVER_TIMESTAMP,
        });
    }
});

router.put("/update", updateUserDataInputValidation, checkTokenValidity, async (req, res) => {
    const { username, password, phone, address, userType } = req.data;
    const { id } = req.user;

    const updateFields = {};
    if (username !== undefined && username !== null) updateFields.username = username;
    if (password !== undefined && password !== null) updateFields.password = hashPassword(password);
    if (phone !== undefined && phone !== null) updateFields.phone = phone;
    if (address !== undefined && address !== null) updateFields.address = address;
    if (userType !== undefined && userType !== null) updateFields.userType = userType;

    if (Object.keys(updateFields).length > 0) {
        const data = await User.updateOne({ _id: id }, { $set: updateFields });
        res.status(200).json({
            status: "SUCCESS",
            message: "User data updated",
            error: null,
            timestamp: SERVER_TIMESTAMP
        })
    } else {
        res.status(411).json({
            status: "INVALID_PAYLOAD",
            message: null,
            error: "Nothing fields sent to update",
            timestamp: SERVER_TIMESTAMP
        })
    }
})

router.delete("/delete/:id", checkTokenValidity, async (req, res) => {
    const id = req.params["id"];
    const authUserId  = req.user.id;
    if (id === authUserId) {
        await User.findByIdAndDelete(authUserId);
        res.sendStatus(204);
    } else {
        res.status(411).json({
            status: "INVALID_USER_ID",
            message: null,
            error: `User with id : ${id} does not exists`,
            timestamp: SERVER_TIMESTAMP
        })
    }
})

module.exports = router;