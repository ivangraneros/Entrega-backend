import UserDao from "../data-access-object/userDao.js";
import productManager from "../data-access-object/productDao.js";
import cartManager from "../data-access-object/cartDao.js";
import TicketDao from "../data-access-object/ticketDao.js";

import ProductRepository from "./products.repository.js";
import CartRepository from "./cart.repository.js";
import UserRepository from "./user.repository.js";
import TicketRepository from "./ticket.repository.js";


const userDao = new UserDao();
const productDao = new productManager();
const cartDao = new cartManager();
const ticketDao = new TicketDao();


export const userRepository = new UserRepository(userDao);
export const productRepository = new ProductRepository(productDao);
export const cartRepository = new CartRepository(cartDao);
export const ticketRepository = new TicketRepository(ticketDao);

