const dotenv = require("dotenv");
dotenv.config(); // .env is added in root directory

const PORT = process.env.PORT || 3000
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
const SERVER_TIMESTAMP = new Date();
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    PORT,
    MONGODB_CONNECTION_URL,
    SERVER_TIMESTAMP,
    JWT_SECRET
}