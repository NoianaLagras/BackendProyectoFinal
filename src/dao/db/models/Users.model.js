import { Schema , model } from "mongoose";

const UserSchema  = new Schema({
email:{
    type:String,
    require:true,
    unique: true,
},
Usuario:{
    type:String,
    require:true
},
password:{
    type:String,
    require:true
}
})

export const UserModel = model('Users', UserSchema )