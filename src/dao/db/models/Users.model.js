import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isGithub: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    age: {
        type: Number
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Carts'
    }
});

export const UserModel = model('Users', UserSchema);
