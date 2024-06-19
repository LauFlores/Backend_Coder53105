// const productRepository = require('../repositories/product.repository.js');

// exports.verificarStock = async (carrito) => {
//   for (let producto of carrito) {
//     const stock = await productRepository.obtenerStock(producto.id);
//     if (stock > 0) {
//       return true;
//     }
//   }
//   return false;
// };

const ProductRepository = require('../repositories/product.repository.js');
const productRepository = new ProductRepository();

async function verificarStock(productos) {
    try {
        const productIds = productos.map(item => item.product._id || item.product); // Asegúrate de tener solo los IDs de los productos
        const productosConStock = await productRepository.obtenerStockDeProductos(productIds);

        const productosNoDisponibles = productosConStock.filter(productoConStock => {
            const productoEnCarrito = productos.find(item => item.product.toString() === productoConStock.id.toString());
            return productoEnCarrito.quantity > productoConStock.stock;
        });

        return {
            hayStock: productosNoDisponibles.length === 0,
            productosNoDisponibles: productosNoDisponibles.map(p => p.title) // Opcional, para mostrar nombres de productos no disponibles
        };
    } catch (error) {
        throw new Error("Error al verificar el stock");
    }
}

module.exports = {
    verificarStock
};
