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
},
isGithub:{
    type: Boolean,
    default:false,
},
isAdmin:
 { type: Boolean,
  default: false }
})

export const UserModel = model('Users', UserSchema )