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

export default router;