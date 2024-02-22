import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import viewRouter from './routes/views.router.js'


const app = express();
const PORT = 8080;

//midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//carpeta public
app.use(express.static(__dirname + '/public/'))

//Configuracion de Hndlebars
app.engine('handlebars', engine()); //extension de los archivos handlebars
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//puntos de entrada para ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

//Ruta test para handlebars
//view router
app.use('/realtimeproducts', viewRouter)
app.use('/', viewRouter)

app.listen(PORT, (req,res)=>{
    console.log(`servidor escuchando en el puerto: http://localhost:${PORT}`);
})