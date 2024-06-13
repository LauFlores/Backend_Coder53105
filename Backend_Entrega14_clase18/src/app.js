

const express = require("express");
const app = express(); 
const PUERTO = 8080; 
const addLogger = require("./utils/logger.js");
const configObject = require("./config/config.js");



//Middleware
app.use(addLogger);

//Rutas

app.get("/", (req, res) => {
    res.send("Olis!");
})


//Ruta para probar todoooo: 

app.get("/loggertest", (req, res) => {
    req.logger.error("Error fatal");
    req.logger.debug("Mensaje de debug");
    req.logger.info("Mensaje de Info");
    req.logger.warning("Mensaje de Warning");
    console.log(configObject.node_env);
    res.send("Test de logs");
})

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
})
