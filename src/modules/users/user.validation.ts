import { z } from "zod";

export class UserValidationSchema {
  static register = z.object({
    email: z.string().trim().toLowerCase().email("It has to be an email"),
    password: z
      .string()
      .min(6)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    username: z.string().optional(),
  });

  static login = z.object({
    email: z.string().trim().toLowerCase().email("It has to be an email"),
    password: z.string(),
  });
}

export type RegisterInput = z.infer<typeof UserValidationSchema.register>;
export type LoginInput = z.infer<typeof UserValidationSchema.login>;
