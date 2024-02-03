
// Se crea  un constructor con el elemento productos, el cual es un arreglo vacío

class ProductManager {
    constructor() {
        this.productos = [];
        this.productoContadorId = 1;
    }

// Se cuenta con un método “agregarProducto” el cual valida que no se repita el campo "codigo" de producto y que todos
// los campos sean obligatorios. Al agregar el producto, se crea con un id autoincrementable.

    agregarProducto(producto) {
        if (!this.productoValido(producto)) {
            console.log("Producto Invalido");
            return;
        }

        if (this.codigoDuplicado(producto.codigo)) {
            console.log("Codigo del producto ya existe");
            return;
        }

        producto.id = this.productoContadorId++;
        this.productos.push(producto);
    }

//  Se cuenta con un método “getProducts” el cual devuelve el arreglo con todos los productos creados hasta ese momento.

    getProducts() {
        return this.productos;
    }

// Se cuenta con un método “getProductById” el cual busca en el arreglo que el producto coincida con el id. 
// En caso de no coincidir ningún id, se muestra en consola un error “Producto no encontrado”

    getProductById(id) {
        const producto = this.productos.find(prod => prod.id === id);
        if (!producto) {
            console.log("Producto no encontrado");
        }
        return producto;
    }

// Propiedades de cada producto 

    productoValido(producto) {
        return (
            producto.titulo &&
            producto.descripcion &&
            producto.precio &&
            producto.imagen &&
            producto.codigo &&
            producto.stock !== undefined
        );
    }

    codigoDuplicado(codigo) {
        return this.productos.some(prod => prod.codigo === codigo);
    }
}


const productManager = new ProductManager();

productManager.agregarProducto({
    titulo: "producto prueba",
    descripcion: "Este es un producto prueba",
    precio: 200,
    imagen: "Sin imagen",
    codigo: "abc123",
    stock: 25
});

productManager.agregarProducto({
    titulo: "Producto prueba2",
    descripcion: "Descripción del producto 2",
    precio: 100,
    imagen: "ruta/imagen2.jpg",
    codigo: "abc223",
    stock: 10
});




console.log("Lista de productos:", productManager.getProducts());
console.log("Producto con ID 1:", productManager.getProductById(1));
console.log("Producto con ID 2:", productManager.getProductById(2));
console.log("Producto con ID 3:", productManager.getProductById(3));