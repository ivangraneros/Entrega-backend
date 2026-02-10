import express from "express";
const router = express.Router();
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";


router.post('/registro', async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ error: 'Ingrese todos los datos' })

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



router.post('/login', async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) return res.status(400).send({ error: 'Ingrese email y password' })
        
    const usuario = await userModel.findOne({ email }).lean()

    if (!usuario) return res.status(400).send({ error: `Error credenciales` });


    if (!usuario.password || !bcrypt.compareSync(password, usuario.password)) {
    return res.status(400).send({ error: `Error credenciales` });
    }


    
    delete usuario.password


    let token = jwt.sign(usuario, "secretKey", { expiresIn: '24h' })

    res.cookie("tokencookie", token, { httpOnly: true }).send({ status: "success", message: "Usuario logueado"})
})


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {    
    res.send({ status: "success", payload: req.user })
})

export default router;