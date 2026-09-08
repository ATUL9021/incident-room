import express from "express";
import { authenticate } from "../../middleware/auth.middlware.js";
import { JoinRequestsController } from "./join_requests.controller.js";
import { JoinRequestsService } from "./join_requests.service.js";
import { pool } from "../../database/database.js";
import { JoinRequestsRepository } from "./join_requests.repository.js";
import { validate } from "../../middleware/validate.middlware.js";
import { statusCodeSchema } from "./join_requests.validation.js";

const router = express.Router();

const joinRequestsController = new JoinRequestsController(
  new JoinRequestsService(new JoinRequestsRepository(pool)),
);

// => /organizations/:organizatinId/join-requests

router.post(
  "/:organizationId/join-requests",
  authenticate,
  joinRequestsController.create,
);
router.get(
  "/:organizationId/join-requests",
  authenticate,
  joinRequestsController.getAll,
);
router.get(
  "/:organizationId/join-requests/:requestId",
  authenticate,
  joinRequestsController.get,
);

router.delete(
  "/:organizationId/join-requests/:requestId",
  authenticate,
  joinRequestsController.delete,
);

//organizations/:organizationId/join-requests/:requestId

router.patch(
  "/:organizationId/join-requests/:requestId",
  authenticate,
  validate({ body: statusCodeSchema }),
  joinRequestsController.update,
);
export default router;
