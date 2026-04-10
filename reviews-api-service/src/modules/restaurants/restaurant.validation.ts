import { z } from "zod";

export class RestaurantValidationSchema {
  static params = z.object({
    id: z.string().uuid("Restaurant id must be a valid UUID"),
  });

  static create = z
    .object({
      name: z.string().trim().min(1, "Restaurant name is required").max(120),
    })
    .strict();

  static update = z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Restaurant name is required")
        .max(120)
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    });
}

export type RestaurantParamsInput = z.infer<typeof RestaurantValidationSchema.params>;
export type RestaurantCreateInput = z.infer<typeof RestaurantValidationSchema.create>;
export type RestaurantUpdateInput = z.infer<typeof RestaurantValidationSchema.update>;