import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
    first_name: {
        type: String 
        },

    last_name: {
        type: String 
        },

    email: {
        type: String,
        unique: true,
        required: true 
        },

    age: { 
        type: Number,
        required: true
        },

    password: { 
        type: String,
        required: true 
        },

    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts' 
        },

    role: { 
        type: String, 
        default: 'user',
        enum: ['user', 'admin']
         }
});



export default mongoose.model('users', userModel);