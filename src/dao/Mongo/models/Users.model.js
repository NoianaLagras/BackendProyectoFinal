import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name:{
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
        enum: ['Admin', 'User','Premium'],
        default: 'User'
    },
    age: {
        type: Number
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Carts'
    },
    orders:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: 'Orders'
        }],
        default:[]
    },
    resetToken: {
            token: String,
            expiration: Date,
        },
    documents: {
        type:[{
            name: String,
            reference: String,
        }],
        default:[],
    },

    last_connection: {
        type: Date,
        default: null 
        },

    avatar: {
        type: String,
        //default: faker.image.avatar(),
    },
    /* ??? avatar: {
        type: {
            path: String, // Ruta o nombre del archivo
            originalName: String, // Nombre original del archivo
        },
        default: {
            path: faker.image.avatar(),
            originalName: "default-avatar.png",
        },
    }, */
});

export const UserModel = model('Users', UserSchema);
