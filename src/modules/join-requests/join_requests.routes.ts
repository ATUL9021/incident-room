import express from "express";
import { authenticate } from "../../middleware/auth.middlware.js";
import { JoinRequestsController } from "./join_requests.controller.js";
import { JoinRequestsService } from "./join_requests.service.js";
import { pool } from "../../database/database.js";
import { JoinRequestsRepository } from "./join_requests.repository.js";

const router = express.Router();

const joinRequestsController = new JoinRequestsController(
  new JoinRequestsService(new JoinRequestsRepository(pool)),
);

// => /organizations/:organizatinId/join-requests

router.post("/:organizationId/join-requests", authenticate);
router.get("/:organizationId/join-requests", authenticate);
router.get("/:organizationId/join-requests/:requestId", authenticate);

router.delete("/:organizationId/join-requests/:requestId", authenticate);

// router.patch("/:organizationId/join-requests/:requestId");
export default router;
