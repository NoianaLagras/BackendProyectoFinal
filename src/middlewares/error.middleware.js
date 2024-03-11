import { logger } from "../config/logger.js";
export const errorMiddleware = (error, req, res, next) => {
    logger.error(error);
    if (error.code === "redirect_uri_mismatch") {
      return res.redirect("/"); 
  }
    res
      .status(error.code || 500)
      .json({ message: error.message, name: error.name });
  };
