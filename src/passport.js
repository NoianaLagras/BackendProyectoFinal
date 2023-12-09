import passport from 'passport';
import { usersManager } from './dao/db/manager/users.manager.js';
import { cartsManager } from './dao/db/manager/carts.manager.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { hashData , compareData } from './utils.js';
import config from './config.js';


passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
        const { Usuario } = req.body;
        if (!Usuario || !password || !email ) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData(password);
        
            const newCart = await cartsManager.createCart();

            if (email === config.admin_email && password === config.admin_password) {
                const createdAdmin = await usersManager.createOne({
                    ...req.body,
                    password: hashedPassword,
                    role: 'Admin',
                    cartId: newCart._id
                });
                return done(null, createdAdmin);
            }

            const createdUser = await usersManager.createOne({
                ...req.body,
                password: hashedPassword,
                cartId: newCart._id
            });

            return done(null, createdUser);
        } catch (error) {
            done(error);
        }
    }));




//Login  

passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

    if (!email || !password) {
        return done(null, false);
    }
    try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return done(null, false);
        }
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
            return done(null, false);
        }
        
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));
//Github 
passport.use('github', new GithubStrategy({
    clientID: config.git_client_id,
    clientSecret: config.git_client_secret,
    callbackURL: "http://localhost:8080/api/sessions/callback",
},async(accessToken,refreshToken,profile,done)=>{
    try {

        const userDB = await usersManager.findByEmail(profile._json.email) 

        const newCart = await cartsManager.createCart();

        //login
        if (userDB){
        if(userDB.isGithub){
        return done (null, userDB)
        }else{
            done(error);
            return done(null,false)
        }
    }
    //signup 
    const infoUser={
        Usuario:profile._json.name,
        email: profile._json.email ,
        password: ' ',
        isGithub:true,
        cartId: newCart._id
    }
    const createUser = await usersManager.createOne(infoUser)
    
    return done ( null, createUser)
    } catch (error) {
        done(error)
    }
}))

//JWT 
const fromCookies =(req)=>{return req.cookies.token}

passport.use('jwt', new JwtStrategy 
({jwtFromRequest: ExtractJwt.fromExtractors([fromCookies])
//({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    ,secretOrKey:config.secret_jwt},async function(jwt_payload,done) {
    done(null, jwt_payload)
})
)

passport.serializeUser((user,done) =>{
    done(null,user._id)
})

passport.deserializeUser(async(id,done) =>{
try {
    const user = await usersManager.findById(id);
    done (null,user)
} catch (error) {
    done(error)
}
})


