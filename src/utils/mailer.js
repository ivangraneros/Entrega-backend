import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ivan.capo.2003@gmail.com',
        pass: "oapa xjyr tvgz ffbw",
    }
});

export const sendEmail = async (email, token) => {
    const link = `http://localhost:8080/api/views/resetcontrasena?token=${token}`;
    await transporter.sendMail({
        from: 'Ecommerce <noreply@coder.com>',
        to: email,
        subject: 'Restablecer contraseña',
        html: `
            <div>
                <h1>Restablece tu contraseña</h1>
                <p>Haz clic en el siguiente botón para cambiar tu clave. Este enlace expira en 1 hora.</p>
                <a href="${link}">
                    <button>Restablecer Contraseña</button>
                </a>
            </div>
        `
    });
}