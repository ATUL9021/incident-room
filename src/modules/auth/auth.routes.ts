import express from "express";
import { validate } from "../../middleware/validate.middlware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import { authenticate } from "../../middleware/auth.middlware.js";
import { pool } from "../../database/database.js";
const router = express.Router();

const authController = new AuthController(
  new AuthService(new AuthRepository(pool)),
);

router.post(
  "/register",
  validate({ body: registerSchema }),
  authController.register.bind(authController),
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  authController.login.bind(authController),
);

router.post(
  "/refresh",

  authController.refresh.bind(authController),
);

router.put("/logout", authenticate, authController.logout.bind(authController));
router.get("/atul", authenticate, (req, res, next) => {
  res.status(200).send({ message: "HI atul bro" });
});

export default router;
