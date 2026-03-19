import express from "express";
const router = express.Router();
import productsModel from "../models/products.model.js";




import ProductManager from"../data-access-object/productDao.js";
import passport from "passport";
const newProductManager = new ProductManager();


// vista de handlebars de productos

router.get('/', async (req, res) => {
  try {
    const result = await newProductManager.getAllProducts(req.query);
    const { limit = 5, sort, query } = req.query;
    const queryParams = `${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}&limit=${limit}`;

    res.render('pages/home', {        
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista de productos");
  }
});

router.get('/realtimeproducts',
  passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
  
  async (req, res) => {
  try {
    const products = await newProductManager.getAllProducts({});

    res.render("pages/realTimeProducts", { products,
      user : req.user });

  } catch (error) {
    res.status(500).send("Error al cargar la vista de productos en tiempo real");
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.pid).lean();
    if (product) {
      res.render("pages/products", { product });
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al obtener el producto");
  }
});


router.post("/", async (req, res) => {
  try {
  const productData = req.body;
  console.log("Body recibido:", productData);
  await newProductManager.createProduct(productData);
  res.render("pages/realTimeProducts", { products });
  } catch (error) {
    res.status(500).json('Error al agregar producto')
  }
});



export default router;