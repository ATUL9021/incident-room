import { z } from "zod";

export const statusCodeSchema = z.object({
  status: z.enum(["declined", "accepted", "pending"]),
});
