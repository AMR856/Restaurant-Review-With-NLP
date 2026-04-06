import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantValidationSchema } from "./restaurant.validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags:
 *       - Restaurants
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get("/", RestaurantController.list);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a restaurant
 *     tags:
 *       - Restaurants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post(
  "/",
  validate(RestaurantValidationSchema.create),
  RestaurantController.create,
);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by id
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Restaurant details
 */
router.get(
  "/:id",
  validate(RestaurantValidationSchema.params, "params"),
  RestaurantController.getById,
);

/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     summary: Update a restaurant
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 */
router.patch(
  "/:id",
  validate(RestaurantValidationSchema.params, "params"),
  validate(RestaurantValidationSchema.update),
  RestaurantController.update,
);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 */
router.delete(
  "/:id",
  validate(RestaurantValidationSchema.params, "params"),
  RestaurantController.remove,
);

export default router;
