import express from "express";
import { authenticate } from "../../middleware/auth.middlware.js";
import { OrganizationController } from "./organization.controller.js";
import { OrganizationService } from "./organization.service.js";
import { OrganizationRepository } from "./organization.repository.js";
import { pool } from "../../database/database.js";

export const router = express.Router();
const organizationController = new OrganizationController(
  new OrganizationService(new OrganizationRepository(pool)),
);

router.get("/", authenticate, organizationController.getAll);
router.post("/", authenticate, organizationController.create);
router.get("/:organizationId", authenticate, organizationController.getById);
router.delete("/:organizationId", authenticate, organizationController.delete);
