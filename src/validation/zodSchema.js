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

module.exports = {
    registrationZodSchema,
    loginZodSchema,
    updateUserDataZodSchema
}