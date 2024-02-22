import { Router } from "express";
import ProductManager from "../productManager.js";
import { log } from "console";

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

export default router;
