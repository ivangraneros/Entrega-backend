import express from "express";
const router = express.Router();
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import sessionsController from "../controllers/sessions.controller.js";



router.post('/registro', async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body
        if (!first_name || !last_name || !email || !password || !age) return res.status(400).send({ error: 'Ingrese todos los datos' })

        let usuario = await userModel.find({ email }).lean()
        if (usuario.length > 0) return res.status(400).send({ error: `El usuario ${email} ya existe en la DB` })

        const nuevoCarrito = await cartModel.create({ products: [] });

        const nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                cart: nuevoCarrito._id,
                role: "user"
            };

            const resultado = await userModel.create(nuevoUsuario);
            console.log("Usuario guardado:", resultado);
            res.json({ status: "success", usuarioCreado: resultado }); 
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})



//rutas de recuperar contraseña pero mas limpias

router.post('/login', sessionsController.login);
router.get('/current',
    passport.authenticate('jwt', {session: false}),
    sessionsController.current);
router.post("/olvidecontrasena", sessionsController.olvideContraseña);
router.post("/resetcontrasena", sessionsController.resetContraseña);


export default router;