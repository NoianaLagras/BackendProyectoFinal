import passport from 'passport';
import { usersService } from '../services/users.service.js';
import { compareData, generateResetToken, generateToken, hashData } from '../config/utils.js';
import UserResDTO from '../DTOs/userResponse.dto.js';
import customError from '../errors/errors.generator.js';
import { errorMessage, errorName } from '../errors/errors.enum.js';
import { handleErrors } from '../errors/handle.Errors.js';
import { sendPasswordResetEmail } from '../config/restorePass.js';

class UsersController {
  async signup(req, res, next) {
    passport.authenticate('signup', (err, user, info) => {
      if (err) {
        handleErrors(res, customError.generateError(errorMessage.SIGNUP_ERROR, 500, errorName.SIGNUP_ERROR));
      }
      if (!user) {
        handleErrors(res, customError.generateError(errorMessage.SIGNUP_ERROR, 500, errorName.SIGNUP_ERROR));
      }
      res.redirect('/login');
    })(req, res, next);
  }

  async login(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          throw new Error("Error de autenticación");
        }
  
        req.login(user, { session: false }, async (error) => {
          if (error) {
            throw new Error("Error de inicio de sesión");
          }
  
          const { Usuario, email, role, cartId, _id } = user;
          const token = generateToken({ Usuario, email, role, cartId, _id });
  
          res.cookie('token', token, { maxAge: 120000, httpOnly: true });
          res.redirect('/api/products');
        });
      } catch (error) {
        handleErrors(res, customError.generateError(errorMessage.LOGIN_ERROR, 500, errorName.LOGIN_ERROR));
      }
    })(req, res, next);
  }

  async githubCallback(req, res) {
    try {
      const { Usuario, email, role, cartId , _id } = req.user;
      const token = generateToken({ Usuario, email, role, cartId , _id });
      res.cookie('token', token, { maxAge: 120000, httpOnly: true });
      res.redirect('/api/products');
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GITHUB_CALLBACK_ERROR, 500, errorName.GITHUB_CALLBACK_ERROR));
    }
  }
  
  async signout(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
  }


  async restore(req, res) {
    const { email } = req.body;
    try {
      const user = await usersService.findByEmail(email);

      if (!user) {
        return handleErrors(res, customError.generateError(errorMessage.EMAIL_NOT_FOUND, 404, errorName.EMAIL_NOT_FOUND));
      }

      const resetToken = generateResetToken(email);
      user.resetToken = {
        token: resetToken,
        expiration: new Date(Date.now() + 60 * 60 * 1000),
      };

      await user.save();
      sendPasswordResetEmail(email, resetToken);

      res.status(200).json({ message: 'Correo electrónico enviado para restablecer la contraseña' });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.RESTORE_ERROR, 500, errorName.RESTORE_ERROR));
    }
  }

  async restorePassword(req, res) {
    const { newPassword } = req.body;
    const token = req.params.token;
  
    try {
        const user = await usersService.findByResetToken(token.toString());
        if (!user || !user.resetToken || user.resetToken.expiration < new Date()) {
            return res.redirect('/restore');
        }
  
        const isSamePassword = await compareData(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: 'No puedes restablecer la contraseña con la misma contraseña actual.' });
        }

        const hashedPassword = await hashData(newPassword);
        user.password = hashedPassword;
        user.resetToken = null;
        await user.save();
  
       return res.status(200).json({ success: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error durante el restablecimiento de la contraseña.' });
    }
}


  

  async githubAuth(req, res) {
    passport.authenticate('github', {
      scope: ['user:email', 'read:user'],
      session: false,
    })(req, res);
  }

  async getCurrentUser(req, res) {
    try {
      const userResponseDTO = new UserResDTO(req.user);
      const userEmail = req.user.email;
      res.json({ user: userResponseDTO, email: userEmail });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GET_CURRENT_USER_ERROR, 500, errorName.GET_CURRENT_USER_ERROR));
    }
  }
  
  async updatePremiumUser(req, res) {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;

        const user = await usersService.findById(uid);

        if (!user) {
            return handleErrors(res, customError.generateError(errorMessage.USER_NOT_FOUND, 404, errorName.USER_NOT_FOUND));
        }
        user.role = newRole;
        await user.save();
        return res.json({ userId: uid, currentRole: user.role });
        
    } catch (error) {
        return handleErrors(res, customError.generateError(errorMessage.UPDATE_PREMIUM_USER_ERROR, 500, errorName.UPDATE_PREMIUM_USER_ERROR));
    }
}

}

export const usersController = new UsersController();
