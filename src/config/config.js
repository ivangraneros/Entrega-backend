import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const PORT = 8080;

export const JWT_SECRET = "secretKey";
export const MONGO_URI = "mongodb+srv://ivancapo2003_db_user:Xeneize12@cluster0.kfrcnez.mongodb.net/ecommerce?appName=Cluster0";

export const paths = {
    public: path.join(__dirname, "../../public"),
    views: path.join(__dirname, "../views"),
    products: path.join(__dirname, "../data/products.json"),
    carts: path.join(__dirname, "../data/carts.json")
};

const config = {
    PORT,
    paths,
    jwt_secret: JWT_SECRET,
    mongo_uri: MONGO_URI
};

export default config;