import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  firstName: z.string().min(2, "First name too short"),
  lastName: z.string().min(2, "Last name too short"),
  phone: z.string().optional(),
  tenantId: z.string().optional(),
  roleId: z.string().optional(),
  assignedBy: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required")
});
