import z from "zod";

export const userProfileUpdateSchema = z.object({
  name: z.string().toLowerCase().min(1, "Length should be atleast 1"),
});
