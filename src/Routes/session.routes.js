import {Router} from "express";
import { usersManager } from '../dao/db/manager/users.manager.js'

const sessionRouter = Router();
sessionRouter.post('/singup', async (req, res) => {
    const { Usuario , password , email} = req.body
    if (!Usuario || !password || !email){
        res.status(400).json({message : 'All fields are requires'});
    }
    try {
        const createdUser = await usersManager.createOne(req.body);
        console.log(createdUser)
        res.redirect('/login')
    } catch (error) {
        res.status(500).json({ error });
    }
});

sessionRouter.get('/singout' , (req,res) =>{
req.session.destroy(()=>{
    res.redirect('/login')
})
})


sessionRouter.post('/login', async (req, res) => {
    const {  email , password} = req.body
    if (!email || !password){
        res.status(400).json({message : 'All fields are required'});
    }
    try {
        const user = await usersManager.findByEmail(email);
        if (!user){
            return res.redirect('/singup')
        }
        const isPasswordValid = password === user.password;
        if (!isPasswordValid){
            return res.status(401).json({ message :'Contraseña incorrecta'})
        }
        const sessionInfo = (email === 'adminCoder@coder.com' && password 
        === 'adminCod3r123') ? { email , Usuario : user.Usuario , isAdmin:true} : { email , Usuario : user.Usuario , isAdmin:false}
        req.session.user = sessionInfo;
        return res.redirect ('/api/products')
    } catch (error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

   })
export default sessionRouter