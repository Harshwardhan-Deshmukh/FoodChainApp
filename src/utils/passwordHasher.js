const bycrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

function hashPassword(password) {
    return bycrypt.hashSync(password, SALT_ROUNDS);
}

function verifyPasswordHash(password, hashPassword) {
    return bycrypt.compareSync(password, hashPassword);
}

module.exports = {
    hashPassword,
    verifyPasswordHash
}