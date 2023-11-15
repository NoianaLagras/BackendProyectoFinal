import passport from 'passport';
import { usersManager } from './dao/db/manager/users.manager.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { hashData , compareData } from './utils.js';

passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
        const { Usuario } = req.body;
        if (!Usuario || !password || !email) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData(password);

            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const createdAdminUser = await usersManager.createOne({
                    ...req.body,
                    password: hashedPassword,
                    isAdmin: true,
                });
                return done(null, createdAdminUser);
            }

            const createdUser = await usersManager.createOne({
                ...req.body,
                password: hashedPassword,
            });

            return done(null, createdUser);
        } catch (error) {
            done(error);
        }
    }));


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
    clientID: 'Iv1.e5d05b1cc0a160a6',
    clientSecret: '07f5cdecdae4e2deaa4e34e24c57d191bb974ca9',
    callbackURL: "http://localhost:8080/api/sessions/callback",
},async(accessToken,refreshToken,profile,done)=>{
    try {
        const userDB = await usersManager.findByEmail(profile._json.email);
    //login
        if (userDB){
        if(userDB.isGithub){
        return done (null, userDB)
        }else{
            return done(null,false)
        }
    }
    //signup 
    const infoUser={
        Usuario:profile._json.name,
        email: profile._json.email ,
        password: ' ',
        isGithub:true,
    }
    const createUser = await usersManager.createOne(infoUser)
    return done ( null, createUser)
    } catch (error) {
        done(error)
    }
}))


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


