import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const db = mongoose.connection;
const connectionMongoose = () => {
  mongoose.connect("mongodb+srv://floreslaura1787:coderhouse@cluster0.das1njd.mongodb.net/ecommerce?retryWrites=true&w=majority")
      .then(() => console.log("Conexión exitosa"))
      .catch(() => console.log("Existe un error"))
}

export default connectionMongoose();
