import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const PORT = 8080;

export const paths = {
    public: path.join(__dirname, "../../public"),
    views: path.join(__dirname, "../views"),
    products: path.join(__dirname, "../data/products.json"),
    carts: path.join(__dirname, "../data/carts.json")
};