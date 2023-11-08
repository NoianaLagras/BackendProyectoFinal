import mongoose from "mongoose";

const URI ="mongodb+srv://noiLagras:sUajV3for8LoqE2c@cluster0.atnqnrl.mongodb.net/ecommerce?retryWrites=true&w=majority"
mongoose
.connect(URI)
.then(()=>console.log("Conectado a base de datos"))
.catch((error)=> console.log(error))