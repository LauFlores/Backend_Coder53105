import express from 'express';
import __dirname from './utils.js';
import cartsRouter from './routes/carts.routes.js';
import router from './routes/product.routes.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para archivos estáticos desde la carpeta 'public'

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/carts', cartsRouter);
app.use('/api/products', router);

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('Acceda a /api/carts o a /api/products');
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

