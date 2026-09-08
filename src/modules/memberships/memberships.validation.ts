import { z } from "zod";
export const getAllMembersParamsSchema = z.object({
  organizationId: z.uuid("invalid UUID"),
});

export const membershipParamsSchema = z.object({
  organizationId: z.uuid("invalid UUID"),
  userId: z.uuid("invalid UUID"),
});

export const getMemberByIdSchema = membershipParamsSchema;

export const updateMembershipStatusBodySchema = z.object({
  role: z.enum(["member", "admin", "owner"], "invalid Role"),
});

export const deleteMembershipSchema = membershipParamsSchema;
