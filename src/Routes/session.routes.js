import {Router} from "express";
import { usersManager } from '../dao/db/manager/users.manager.js'
import { hashData } from '../utils.js'
import passport from "passport";
const sessionRouter = Router();

//LOCAL SIGNUP - LOGIN

sessionRouter.post('/signup', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/error'
  }));

  sessionRouter.post('/login', passport.authenticate('login', {
    successRedirect: '/api/products',
    failureRedirect: '/error'
  }));

//GITHUB - LOGIN

sessionRouter.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email', 'read:user']
}));
sessionRouter.get('/callback',passport.authenticate('github'),(req,res)=>{
    console.log('Información del usuario después de autenticar con GitHub:', req.user);
    res.redirect('/api/products');
})




sessionRouter.get('/signout' , (req,res) =>{
req.session.destroy(()=>{
    res.redirect('/login')
})
})




sessionRouter.post('/restore', async (req,res)=>{
    const { email , password} = req.body
    try {
        const user  = await usersManager.findByEmail(email)
        if (!user){
            return res.redirect('/signup')
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message : 'Password Updated Successfully'}
        )
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})
export default sessionRouter





// sin passport
/*sessionRouter.post('/login', async (req, res) => {
    const {  email , password} = req.body
    if (!email || !password){
        res.status(400).json({message : 'All fields are required'});
    }
    try {
        const user = await usersManager.findByEmail(email);
        if (!user){
            return res.redirect('/signup')
        }
        const isPasswordValid = await compareData(password,user.password);
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

   })*/
   
/*sessionRouter.post('/signup', async (req, res) => {
    const { Usuario , password , email} = req.body
    if (!Usuario || !password || !email){
        res.status(400).json({message : 'All fields are requires'});
    }
    try {
        const hashedPassword = await hashData(password);

        const createdUser = await usersManager.createOne({...req.body, password:hashedPassword});
        console.log(createdUser)
        res.redirect('/login')
    } catch (error) {
        res.status(500).json({ error });
    }
});*/