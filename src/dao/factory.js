/* import config from "../config.js";

const persistence = config.persistence;

let Product;
let Carts;
let Users ;
let Message ;
let ticket;
switch (persistence){
    case 'Mongo':
        console.log('Trabajando con MongoDB');
        const mongoose = await import ('mongoose');
        await mongoose.connect ( config.mongo_uri);
       // const { default: ProductManager } = (productManager);
       //Product = ProductManager , despues cambiar el import del service ? 
        // 1:10:00
        break;
    case 'Memory':
        console.log('Trabajando con Memoria');
        break;
} */