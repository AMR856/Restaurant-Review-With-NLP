import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { ReviewController } from "./review.controller";
import { ReviewValidationSchema } from "./review.validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         restaurantId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         sentiment:
 *           type: string
 *           enum: [positive, negative]
 *           nullable: true
 *         confidence:
 *           type: number
 *           format: float
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - restaurantId
 *         - content
 *       properties:
 *         restaurantId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *     UpdateReviewRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *     QueuedReviewJobResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             jobId:
 *               type: string
 *               example: "42"
 *             status:
 *               type: string
 *               example: queued
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: List of reviews
 */

router.get("/", ReviewController.list);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review and enqueue sentiment analysis
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       202:
 *         description: Review created and analysis queued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QueuedReviewJobResponse'
 */

router.post(
  "/",
  validate(ReviewValidationSchema.create),
  ReviewController.create,
);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by id
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review details
 */

router.get(
  "/:id",
  validate(ReviewValidationSchema.params, "params"),
  ReviewController.getById,
);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update a review and re-enqueue sentiment analysis
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       202:
 *         description: Review updated and analysis queued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QueuedReviewJobResponse'
 */

router.patch(
  "/:id",
  validate(ReviewValidationSchema.params, "params"),
  validate(ReviewValidationSchema.update),
  ReviewController.update,
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */

router.delete(
  "/:id",
  validate(ReviewValidationSchema.params, "params"),
  ReviewController.remove,
);

export default router;
