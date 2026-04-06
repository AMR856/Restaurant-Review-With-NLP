import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { ReviewController } from "./review.controller";
import { ReviewValidationSchema } from "./review.validation";

const router = Router();

router.get("/", ReviewController.list);

router.post(
  "/",
  validate(ReviewValidationSchema.create),
  ReviewController.create,
);

router.get(
  "/:id",
  validate(ReviewValidationSchema.params, "params"),
  ReviewController.getById,
);

router.patch(
  "/:id",
  validate(ReviewValidationSchema.params, "params"),
  validate(ReviewValidationSchema.update),
  ReviewController.update,
);

router.delete(
  "/:id",
  validate(ReviewValidationSchema.params, "params"),
  ReviewController.remove,
);

export default router;