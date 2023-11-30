import jwt from 'jsonwebtoken'
const SECRET_KET_JWT = 'secretJWT'


/* export const jwtValidator = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader.split(' ')[1];
        
        const userToken = jwt.verify(token, SECRET_KET_JWT);
        req.user = userToken;
        next();
    } catch (error) {
        res.json({ error: error.message });
    }
}
 */
// jwtValidator middleware
export const jwtValidator = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.user = null;
            req.authenticated = false;
            return next();
        }
        const userToken = jwt.verify(token, SECRET_KET_JWT);
        req.user = userToken;
        req.authenticated = true;
        next();
    } catch (error) {
        req.user = null;
        req.authenticated = false;
        res.json({ error: error.message });
    }
};
