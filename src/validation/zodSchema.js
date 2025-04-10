const zod = require("zod");

const registrationZodSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(5),
    phone: zod.string().length(10),
    address: zod.string(),
    userType: zod.string().refine(value => ["client", "admin", "vendor", "driver"].includes(value), { message: "Invalid User Type" })
});

const loginZodSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(5),
});

const updateUserDataZodSchema = zod.object({
    username: zod.string().optional(),
    password: zod.string().min(5).optional(),
    phone: zod.string().length(10).optional(),
    address: zod.string().optional(),
    userType: zod.string().refine(value => ["client", "admin", "vendor", "driver"].includes(value), { message: "Invalid User Type" }).optional()
});

const restaurantPostSchema = zod.object({
    title: zod.string(),
    imageUrl: zod.string(),
    foods: zod.array(zod.string()),
    pickup: zod.boolean().optional(),
    delivery: zod.boolean().optional(),
    isOpen: zod.boolean().optional(),
    rating: zod.number().optional(),
    ratingCount: zod.string(),
    code: zod.string(),
    coords: zod.object({
        id: zod.string(),
        latitude: zod.number(),
        longitude: zod.number(),
        address: zod.string(),
        title: zod.string()
    })
})

module.exports = {
    registrationZodSchema,
    loginZodSchema,
    updateUserDataZodSchema,
    restaurantPostSchema
}