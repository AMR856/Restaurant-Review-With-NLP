import { z } from "zod";

export class RestaurantValidationSchema {
  static params = z.object({
    id: z.string().uuid("Restaurant id must be a valid UUID"),
  });

  static create = z.object({
    name: z.string().trim().min(1, "Restaurant name is required").max(120),
  });

  static update = z.object({
    name: z.string().trim().min(1, "Restaurant name is required").max(120).optional(),
  });
}

export type RestaurantParamsInput = z.infer<typeof RestaurantValidationSchema.params>;
export type RestaurantCreateInput = z.infer<typeof RestaurantValidationSchema.create>;
export type RestaurantUpdateInput = z.infer<typeof RestaurantValidationSchema.update>;