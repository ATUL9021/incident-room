import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().toLowerCase().min(1, "Organization name is required"),
});
