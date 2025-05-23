const dotenv = require("dotenv");
dotenv.config(); // .env is added in root directory

const PORT = process.env.PORT || 3000
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL || "mongodb://localhost:27017/foodchainapp";
const SERVER_TIMESTAMP = new Date().toISOString();
const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

module.exports = {
    PORT,
    MONGODB_CONNECTION_URL,
    SERVER_TIMESTAMP,
    JWT_SECRET,
    SALT_ROUNDS
}
