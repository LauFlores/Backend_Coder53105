const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();
const { verificarStock } = require("../services/carts.services.js");


class CartController {



    async nuevoCarrito(req, res) {
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.obtenerProductosDeCarrito(carritoId);
            if (!productos) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async agregarProductoEnCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const usuario = req.user;
        try {
            const product = await productRepository.obtenerProductoPorId(productId);

            if (!product) {
                return res.status(404).render('error', {
                    message: 'Producto no encontrado'
                });
            }

            // Verificar si el usuario es premium y si está intentando agregar su propio producto
            if (usuario.role === 'premium' && product.owner === usuario.email) {
                return res.status(403).render('error', {
                    message: 'No puedes agregar al carrito tu propio producto si eres premium'
                });
            }

            if (product.stock < quantity) {
                return res.status(400).render('error', {
                    message: 'No hay suficiente stock para el producto solicitado',
                    product: product
                });
            }

            await cartRepository.agregarProducto(cartId, productId, quantity);
            const carritoID = (req.user.cart).toString();

            res.redirect(`/carts/${carritoID}`);
        } catch (error) {
            res.status(500).send("Error");
        }
    }
    
    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        // Debes enviar un arreglo de productos en el cuerpo de la solicitud
        try {
            const updatedCart = await cartRepository.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarCantidad(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.actualizarCantidadesEnCarrito(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.vaciarCarrito(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    //Ultima Pre Entrega: 
    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;
            
                    // Verificar si el carrito está vacío
            if (products.length === 0) {
                return res.render('error', {
                    message: 'No se puede finalizar la compra porque el carrito está vacío'
                });
            }

            const productosNoDisponibles = [];
            
            // Procesar compra si hay stock suficiente
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId);
                }
            }

            if (productosNoDisponibles.length > 0) {
                // Aquí podrías manejar cómo mostrar el mensaje al usuario
                console.log("Productos no disponibles:", productosNoDisponibles);
            }
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                product.stock -= item.quantity;
                await product.save();
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });
  
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();
            

            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));
            await cart.save();

            
            await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);
            
            
            res.render("checkout", {
                cliente: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket._id,
                productosNoDisponibles: productosNoDisponibles.map(p => p.title)  // Pasar nombres de productos no disponibles
            });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
            
        }
    }

}

module.exports = CartController;

