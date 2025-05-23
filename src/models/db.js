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
    userType: { type: String, required: [true, "user type is required"], enum: ["client", "admin", "vendor", "driver"] },
}, { timestamps: true });

// restaurant
const restaurantSchema = new mongoose.Schema({
    title: { type: String, required: [true, "restaurant title is required"] },
    imageUrl: { type: String, default: "https://picsum.photos/200/300" },
    foods: { type: Array },
    pickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },
    rating: { type: Number, default: 1, min: 1, max: 5 },
    ratingCount: { type: String },
    code: { type: String },
    coords: {
        id: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
        title: { type: String }
    }
}, { timestamps: true });


// models
const User = mongoose.model("user", userSchema);
const Restaurant = mongoose.model("restaurant", restaurantSchema);

module.exports = {
    User,
    Restaurant
}