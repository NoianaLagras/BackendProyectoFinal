
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


const SECRET_JWT_KEY = config.secret_jwt;

export const jwtValidator = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            req.user = null;
            req.authenticated = false;
            req.invalidToken = true;
            return next();
        }

        const userToken = jwt.verify(token, SECRET_JWT_KEY);
        req.user = userToken;
        req.authenticated = true;
        next();
    } catch (error) {
        req.user = null;
        req.authenticated = false;
        req.invalidToken = true;
        next();
    }
};




/* export const jwtValidator = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader.split(' ')[1];
        
        const userToken = jwt.verify(token, SECRET_JWT_KEY);
        req.user = userToken;
        next();
    } catch (error) {
        res.json({ error: error.message });
    }
}
 */