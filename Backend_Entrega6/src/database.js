
// conexión con MongoDB

const mongoose = require ("mongoose")

mongoose.connect("mongodb+srv://floreslaura1787:coderhouse@cluster0.das1njd.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log("Error en la conexión", error))

