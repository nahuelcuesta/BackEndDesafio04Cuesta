import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
    constructor() {
        this.path = "./listaDeProductos.json";
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
        this.products = await this.readProducts();
        } catch (error) {
        console.error("Error al cargar productos:", error);
        this.products = [];
        }
    }

    addProduct = async (
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
    ) => {
        try {
        /* const lastProduct = this.products[this.products.length - 1];
        const lastProductId = lastProduct ? lastProduct.id : 0;
        const newProductId = lastProductId + 1; */
        const newProductId = uuidv4();
        let newProduct = {
            id: newProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        };
        this.products.push(newProduct);
        await this.writeProducts(this.path, this.products);
        return newProduct;
        } catch (error) {
        console.error("Error al agregar producto:", error);
        throw error;
        }
    };

    writeProducts = async (path, data) => {
        await fs.writeFile(path, JSON.stringify(data));
    };

    readProducts = async () => {
        let response = await fs.readFile(this.path, "utf-8");
        return JSON.parse(response) || [];
    };

    getProducts = async () => {
        try {
        let products = await this.readProducts();
        return products;
        } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
        }
    };

    getProductsById = async (id) => {
        try {
        let products = await this.getProducts();
        let prodFilter = products.find(product => product.id == id);
        if (prodFilter !== undefined) {
            return prodFilter;
        } else {
            throw new Error("No existe un producto con el ID proporcionado");
        }
        } catch (error) {
        console.error("Error al obtener productos por ID:", error);
        throw error;
        }
    };

    updateProduct = async (id, dataObjectUpdate) => {
        let products = await this.getProducts();
        let productToUpdate = products.find(product => product.id == id);
        try {
        if (productToUpdate) {
            if (id in dataObjectUpdate) {
            console.log("No se permite actualizar el campo id "); //Evita que se sobreescriba el id accidentalmente
            } else {
            Object.assign(productToUpdate, dataObjectUpdate);
            await this.writeProducts(this.path, products);
            console.log(`Producto con id "${id}" actualizado correctamente.`);
            }
            /* let productToUpdate = products.findIndex(prod=>prod.id === id) // Otra forma de hacerlo por indice
            if (productToUpdate !== -1){
                products[productToUpdate] = {id, ...dataObjectUpdate}
                await fs.writeFile(this.path, JSON.stringify(products))
                        }    */
        } else {
            console.log(
            `No existe un producto con el ID "${id}". No se realizó ninguna operación de actualización.`
            );
        }
        } catch (error) {
        console.log(error);
        }
    };

    deleteProduct = async (id) => {
        try {
        let response = await this.getProducts();
        let productExists = response.some((product) => product.id == id);
        if (productExists) {
            let productFilter = response.filter(product => product.id != id);
            console.log(productFilter);
            await this.writeProducts(this.path, productFilter);
            console.log(`Producto con id "${id}" borrado correctamente.`);
        } else {
            console.log(
            `No existe un producto con el ID "${id}". No se realizó ninguna operación.`
            );
        }
        } catch (error) {
        console.error("Error al eliminar el producto:", error);
        }
    };

    /* deleteProduct = async(id)=>{  //Otra forma de hacerlo
        try {
        const products = await this.getProducts();
        const indexProduct = products.findIndex(product=>product.id == id)
        if (indexProduct !== -1){
            products.splice(indexProduct, 1)
            await this.writeProducts(this.path, products)
            }
        } catch (error) {
            console.log('producto no encontrado');
        } 
    } */
}

export default ProductManager;
