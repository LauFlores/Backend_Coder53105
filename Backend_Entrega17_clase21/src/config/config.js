const dotenv = require("dotenv");


dotenv.config();

const config = {
    connection: process.env.CONNECTION,
    bcryptGenSalt: process.env.BCRYPTGENSALT,
    jwtKey: process.env.JWTKEY,
    mailPassword: process.env.MAILPASSWORD
}

module.exports = config;