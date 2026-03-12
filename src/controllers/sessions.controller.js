import { userRepository } from "../repositories/index.js";
import UserDTO from "../dto/user.dto.js";
import { createHash, validatePassword } from "../utils.js"; 
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendEmail } from "../utils/mailer.js";

class SessionsController {
    
    login = async (req, res) => {

        const { email, password } = req.body;
        const user = await userRepository.getUserWithPassword(email);

        if (!user || !validatePassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Credenciales inválidas" });
        }

        delete user.password
        
        const tokenUser = new UserDTO(user);
        const token = jwt.sign({ ...tokenUser }, config.jwt_secret, { expiresIn: '24h' });

        res.cookie("tokencookie", token, { httpOnly: true })
           .send({ status: "success", message: "Logueado correctamente" });
    }

    
    current = async (req, res) => {
        
        const userDTO = new UserDTO(req.user);
        res.send({ status: "success", payload: userDTO });
    }

    
    olvideContraseña = async (req, res) => {

        const { email } = req.body;
        const user = await userRepository.getUser(email);
        
        if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

        const token = jwt.sign({ email }, config.jwt_secret, { expiresIn: '1h' });
        
        await sendEmail(email, token);
        res.send({ status: "success", message: "Correo de recuperación enviado" });
    }

    
    resetContraseña = async (req, res) => {
        const { token, password } = req.body;

        try {
            const decoded = jwt.verify(token, config.jwt_secret);
            const user = await userRepository.getUser(decoded.email);
            
            if (validatePassword(user, password)) {
                return res.status(400).send({ error: "No puedes usar la misma contraseña anterior" });
            }
            
            const newHashedPassword = createHash(password);
            await userRepository.updateUserPassword(user._id, newHashedPassword);

            res.send({ status: "success", message: "Contraseña actualizada" });
        } catch (error) {
           
            res.status(400).send({ error: "El link expiró o es inválido" });
        }
    }
}

export default new SessionsController();