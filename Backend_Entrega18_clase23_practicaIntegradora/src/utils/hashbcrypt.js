const bcrypt = require("bcrypt");
const config = require("../config/config.js");

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(config.bcryptGenSalt));

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidPassword
}