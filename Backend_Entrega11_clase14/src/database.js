const mongoose = require("mongoose");
const config = require("../src/config/config.js");

mongoose.connect(config.connection)
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Existe un error"))
    