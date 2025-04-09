const mongoose = require("mongoose");
const { MONGODB_CONNECTION_URL } = require("../config/configs");

mongoose.connect(MONGODB_CONNECTION_URL)
    .then(() => console.log("Successfully Connected to MongoDB instance"))
    .catch((err) => console.log(`Failed to connect to Mongodb - ${err.message}`));

// schemas
// user
const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "username is required"] },
    email: { type: String, required: [true, "email is required"], unique: true },
    password: { type: String, required: [true, "password is required"] },
    address: { type: String, required: [true, "address is required"] },
    phone: { type: String, required: [true, "phone number is required"] },
    userType: { type: String, required: [true, "user type is required"], default: "client", enum: ["client", "admin", "vendor", "driver"] },
}, { timestamps: true });

// models
// user
const User = mongoose.model("user", userSchema);

module.exports = {
    User
}