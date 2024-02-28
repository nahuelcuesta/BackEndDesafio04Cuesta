import { Router } from "express";
import ProductManager from "../productManager.js";

const pManager = new ProductManager();

const router = Router();



router.get('/', async (req, res) => {
    try {
        const products = await pManager.getProducts();
        res.render('home',
            {
                products
            })
    } catch (error) {

    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await pManager.getProducts(); 
        console.log(productos);
        res.render('realTimeProducts',
            {
                productos
            })

    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;
