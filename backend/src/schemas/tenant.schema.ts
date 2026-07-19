import { z } from "zod";

export const createTenantSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    schoolName: z.string().min(2, "School name is required").optional(),
    domain: z.string().optional(),
    adminFirstName: z.string().min(2, "Admin first name is required"),
    adminLastName: z.string().min(2, "Admin last name is required"),
    adminEmail: z.string().email("Invalid email format"),
    plan: z.enum(["starter", "professional", "enterprise"]).default("starter"),
    logoBase64: z.string().optional(),
  }).refine((data) => data.name || data.schoolName, {
    message: "Either name or schoolName must be provided",
    path: ["name"]
  })
});
