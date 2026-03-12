import { Router } from "express";
import passport from "passport";


const router = Router();

router.get("/registro", (req, res) => {
    res.render("pages/registro"); 
});

router.get("/login", (req, res) => {
    res.render("pages/login");
});

router.get("/perfil", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.render("pages/current", { user: req.user });
});

router.get("/resetcontrasena", (req, res) => {
    const { token } = req.query;
    res.render("pages/resetContraseña", { token });
});

router.get("/olvidecontrasena", (req, res) => {
    res.render("pages/olvideContrasena");
});

export default router;