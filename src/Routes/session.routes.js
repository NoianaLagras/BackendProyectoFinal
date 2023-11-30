import {Router} from "express";
import { usersManager } from '../dao/db/manager/users.manager.js'
import { generateToken, hashData,compareData} from '../utils.js'
import passport from "passport";

const sessionRouter = Router();

//LOCAL SIGNUP - LOGIN
//Usando passport 
sessionRouter.post('/signup', (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/error');
        }

        res.redirect('/login')})
        (req, res, next);
});

sessionRouter.post('/login', passport.authenticate('login', {}), (req, res) => {
    const { Usuario, email, role, cartId } = req.user;
    const token = generateToken({ Usuario, email, role, cartId });
    res.cookie('token', token, { maxAge: 60000, httpOnly: true });
    res.redirect('/api/products');
});
//GITHUB - LOGIN

sessionRouter.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email', 'read:user'],session: false 
}));

sessionRouter.get('/callback', passport.authenticate('github', { session: false }), (req, res) => {
    try {
        const { Usuario, email, role ,cartId } = req.user;
        const token = generateToken({ Usuario, email, role,cartId });
        res.cookie('token', token, { maxAge: 60000, httpOnly: true });
       res.redirect('/api/products');
    } catch (error) {
        res.redirect('/error'); 
    }
});


// Current 
sessionRouter.get('/current' ,passport.authenticate('jwt', { session: false }), (req, res) => {
res.json({ user: req.user });
  });
    


// sessionRouter
sessionRouter.get('/signout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});




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





// sin passport y con token de jwt
/* sessionRouter.post('/login', async (req, res) => {
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
        //Con sesiones 
        /* const sessionInfo = (email === 'adminCoder@coder.com' && password 
        === 'adminCod3r123') ? { email , Usuario : user.Usuario , isAdmin:true} : { email , Usuario : user.Usuario , isAdmin:false}
        req.session.user = sessionInfo; */
        //return res.redirect ('/api/products')
        //con jwt : 
       // onst { Usuario , role } = user
        //const token  = generateToken({ Usuario  , email ,role} )
        //res.json({message: "Token :", token})c
        // cambiar api/products a que si hay un token en cookies se pueda entrar
      //  res.status(200).cookie('token:', token, {httpOnly:true}).json({message: 'Bienvenido',token})
    //} catch (error){
     //   res.status(500).json({ message: "Internal Server Error", error: error.message });
    //}

   //}) */
   
/* sessionRouter.post('/signup', async (req, res) => {
    const { Usuario , password , email } = req.body
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
}); */