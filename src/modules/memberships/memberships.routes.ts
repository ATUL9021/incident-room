import express from "express";
import { authenticate } from "../../middleware/auth.middlware.js";
import { MemebershipsController } from "./memberships.controller.js";
import { pool } from "../../database/database.js";
import { MembershipsService } from "./memberships.service.js";
import { MembershipsRepository } from "./memberships.repository.js";
import { validate } from "../../middleware/validate.middlware.js";
import {
  deleteMembershipSchema,
  getAllMembersParamsSchema,
  getMemberByIdSchema,
  membershipParamsSchema,
  updateMembershipStatusBodySchema,
} from "./memberships.validation.js";

const router = express.Router();

const membershipController = new MemebershipsController(
  new MembershipsService(new MembershipsRepository(pool)),
);
// POST organizations/:requestId/

//admin should able to edit the membership , delete the users members,
//get the users membership ,

// admin or owner can get all members only

router.get(
  "/:organizationId/members",
  validate({
    params: getAllMembersParamsSchema,
  }),
  authenticate,
);

//admin or owner or that user can get his membership

router.get(
  "/:organizationId/members/:userId",
  validate({
    params: getMemberByIdSchema,
  }),
  authenticate,
);

// only admin or owner can edit
router.patch(
  "/:organizationId/members/:userId",
  validate({
    body: updateMembershipStatusBodySchema,
    params: membershipParamsSchema,
  }),
  authenticate,
);

// only admin or owner can edit.
router.delete(
  "/:organizationId/members/:userId",
  validate({
    params: deleteMembershipSchema,
  }),
  authenticate,
);

export default router;
