
import { errorMessage} from '../errors/errors.enum.js';

export const authMiddleware = (authorizedRole) => {
    return (req, res, next) => {
        if (!req.authenticated) {
            if (req.invalidToken) {
                req.session.errorMessage = errorMessage.INVALID_CREDENTIALS;
            } else {
                req.session.errorMessage = errorMessage.AUTHORIZATION_ERROR;
            }

            return res.redirect('/error');
        }

        if (!req.user || !authorizedRole.includes(req.user.role)) {
            console.log('Not authorized');
            req.session.errorMessage = errorMessage.INVALID_CREDENTIALS;
            return res.redirect('/error');
        }

        next();
    };
};
