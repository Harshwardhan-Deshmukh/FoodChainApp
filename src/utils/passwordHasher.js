const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

function hashPassword(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

function verifyPasswordHash(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
}

module.exports = {
    hashPassword,
    verifyPasswordHash
}