const { Router } = require("express");
const { restaurantDataInputValidation } = require("../middlewares/inputValidationMiddleware");
const { Restaurant } = require("../models/db");
const { SERVER_TIMESTAMP } = require("../config/configs");
const { checkTokenValidity } = require("../middlewares/authMiddleware");
const router = Router();

router.post("/", checkTokenValidity, restaurantDataInputValidation, async (req, res) => {
    const { userType } = req.user;
    if (userType === "admin" || userType === "vendor") {
        const {
            title,
            imageUrl = "https://picsum.photos/200/300",
            foods = [],
            pickup = true,
            delivery = true,
            isOpen = true,
            rating = 1,
            ratingCount,
            code,
            coords
        } = req.body;
        const newRestaurant = new Restaurant({
            title,
            imageUrl,
            foods,
            pickup,
            delivery,
            isOpen,
            rating,
            ratingCount,
            code,
            coords
        });
        await newRestaurant.save();
        res.status(201).json({
            status: "SUCCESS",
            message: "Restaurant Created Successfully",
            error: null,
            timestamp: SERVER_TIMESTAMP,
        });
    } else {
        res.status(403).json({
            status: "UNAUTHORIZED",
            message: null,
            error: "Admin or Vendor can only add Restaurants",
            timestamp: SERVER_TIMESTAMP,
        });
    }
});

router.get("/", async (req, res) => {
    const restaurants = await Restaurant.find({});
    if (restaurants) {
        const finalResult = restaurants.map(restaurant => {
            const { _id, __v, ...data } = restaurant._doc;
            return { id: _id, ...data };
        });
        res.status(200).json({
            status: "SUCCESS",
            message: finalResult,
            error: null,
            timestamp: SERVER_TIMESTAMP,
        });
    } else {
        res.status(200).json({
            status: "SUCCESS",
            message: {},
            error: null,
            timestamp: SERVER_TIMESTAMP,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById({ _id: req.params["id"].toString() });
        const { _id, __v, ...data } = restaurant._doc;

        res.status(200).json({
            status: "SUCCESS",
            message: { id: _id, ...data },
            error: null,
            timestamp: SERVER_TIMESTAMP,
        });
    } catch (err) {
        err.statusCode = 404;
        err.message = "Restaurant not found"
        throw err;
    }
});

module.exports = router;