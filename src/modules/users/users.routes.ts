import express from "express";
import { validate } from "../../middleware/validate.middlware.js";
import { authenticate } from "../../middleware/auth.middlware.js";
import { userProfileUpdateSchema } from "./users.validation.js";
import { UserController } from "./users.controller.js";
import { UserService } from "./users.service.js";
import { UserRepository } from "./users.repository.js";
import { pool } from "../../database/database.js";
const router = express.Router();

const userController = new UserController(
  new UserService(new UserRepository(pool)),
);
router.get("/me", authenticate, userController.get);
router.patch(
  "/me",
  validate({ body: userProfileUpdateSchema }),
  authenticate,
  userController.update,
);
export default router;
