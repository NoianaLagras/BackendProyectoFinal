import passport from 'passport';
import { usersService } from '../services/users.service.js';
import { generateToken, hashData } from '../config/utils.js';
import UserResDTO from '../DTOs/userResponse.dto.js';
import customError from '../errors/errors.generator.js';
import { errorMessage, errorName } from '../errors/errors.enum.js';
import { handleErrors } from '../errors/handle.Errors.js';

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
      if (err || !user) {
        handleErrors(res, customError.generateError(errorMessage.LOGIN_ERROR, 500, errorName.LOGIN_ERROR));
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          handleErrors(res, customError.generateError(errorMessage.LOGIN_ERROR, 500, errorName.LOGIN_ERROR));
        }

        const { Usuario, email, role, cartId } = user;
        const token = generateToken({ Usuario, email, role, cartId });

        res.cookie('token', token, { maxAge: 120000, httpOnly: true });
        res.redirect('/api/products');
      });
    })(req, res, next);
  }

  async signout(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  async restorePassword(req, res) {
    const { email, password } = req.body;
    try {
      const user = await usersService.findByEmail(email);
      if (!user) {
        handleErrors(res, customError.generateError(errorMessage.EMAIL_NOT_FOUND, 404, errorName.EMAIL_NOT_FOUND));
      }

      const hashedPassword = await hashData(password);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password Actualizada' });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.RESTORE_PASSWORD_ERROR, 500, errorName.RESTORE_PASSWORD_ERROR));
    }
  }

  async githubCallback(req, res) {
    try {
      const { Usuario, email, role, cartId } = req.user;
      const token = generateToken({ Usuario, email, role, cartId });
      res.cookie('token', token, { maxAge: 120000, httpOnly: true });
      res.redirect('/api/products');
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GITHUB_CALLBACK_ERROR, 500, errorName.GITHUB_CALLBACK_ERROR));
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
}

export const usersController = new UsersController();
