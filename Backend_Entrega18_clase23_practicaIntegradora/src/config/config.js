

const dotenv = require("dotenv");


dotenv.config();

const config = {
    mongo_url: process.env.MONGO_URL,
    bcryptGenSalt: process.env.BCRYPTGENSALT,
    // jwtKey: process.env.JWTKEY,
    mailPassword: process.env.MAILPASSWORD
}

module.exports = config;