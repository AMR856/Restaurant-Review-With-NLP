import { z } from "zod";

export class ReviewValidationSchema {
  static params = z.object({
    id: z.string().uuid("Review id must be a valid UUID"),
  });

  static create = z.object({
    restaurantId: z.string().uuid("Restaurant id must be a valid UUID"),
    content: z.string().trim().min(1, "Review content is required"),
  });

  static update = z.object({
    content: z.string().trim().min(1, "Review content is required").optional(),
  });
}

export type ReviewParamsInput = z.infer<typeof ReviewValidationSchema.params>;
export type ReviewCreateInput = z.infer<typeof ReviewValidationSchema.create>;
export type ReviewUpdateInput = z.infer<typeof ReviewValidationSchema.update>;