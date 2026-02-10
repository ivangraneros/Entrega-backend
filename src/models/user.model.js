import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }, // El ID del carrito
    role: { type: String, default: 'user' }
});



export default mongoose.model('users', userModel);