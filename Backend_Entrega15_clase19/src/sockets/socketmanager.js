const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await productRepository.obtenerProductos() );

            socket.on("eliminarProducto", async (id) => {
                await productRepository.eliminarProducto(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (productos) => {
                await productRepository.agregarProducto(productos);
                console.log(productos);
                this.emitUpdatedProducts(socket);
            });

            // Escuchar evento para modificar producto
            // socket.on("modificarProducto", async ({ id, producto }) => {
            //     try {
            //         const productoActualizado = await Producto.findByIdAndUpdate(id, producto, { new: true });
            //         if (!productoActualizado) {
            //             throw new Error("Producto no encontrado");
            //         }
            //         // Emitir evento a todos los clientes conectados para actualizar la lista de productos
            //         this.emitUpdatedProducts();
            //     } catch (error) {
            //         console.error("Error al modificar el producto:", error.message);
            //     }
            // });
            socket.on("modificarProducto", async ({ id, productos }) => {
                try {
                    const productoActualizado = await productRepository.actualizarProducto(id, productos);
                    console.log(productos);
                    this.emitUpdatedProducts(socket);
                    if (!productoActualizado) {
                        socket.emit("errorModificarProducto", "Producto no encontrado o no se pudo actualizar.");
                    } else {
                        this.emitUpdatedProducts(socket);
                    }
                } catch (error) {
                    console.error("Error al modificar el producto:", error.message);
                    socket.emit("errorModificarProducto", "Error al modificar el producto.");
                }
            });


            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    // async emitUpdatedProducts(socket) {
    //     socket.emit("productos", await productRepository.obtenerProductos());
    // }
    async emitUpdatedProducts(socket) {
        try {
            const productos = await productRepository.obtenerProductos();
            socket.emit("productos", productos);
        } catch (error) {
            console.error("Error al obtener productos:", error.message);
            socket.emit("errorObtenerProductos", "Error al obtener productos.");
        }
    }
}

module.exports = SocketManager;


