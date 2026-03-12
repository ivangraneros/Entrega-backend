export const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send({ status: "error", error: "Error interno del servidor" });
}