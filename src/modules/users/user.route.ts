import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { UserValidationSchema } from "./user.validation";

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           description: hashed password
 *         username:
 *           type: string
 *           nullable: true
 *         workouts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Workout'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - email
 *         - password
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: Password with at least 6 characters, 1 uppercase, 1 number, 1 special character
 *           example: StrongP@ss1
 *         username:
 *           type: string
 *           description: Optional username
 *           nullable: true
 *           example: user123
 *       required:
 *         - email
 *         - password
 *
 *     LoginInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: User password
 *           example: StrongP@ss1
 *       required:
 *         - email
 *         - password
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: user@example.com
 *             username:
 *               type: string
 *               nullable: true
 *               example: user123
 *             token:
 *               type: string
 *               description: JWT token
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 */

router.post(
  "/register",
  validate(UserValidationSchema.register),
  UserController.register,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */

router.post(
  "/login",
  validate(UserValidationSchema.login),
  UserController.login,
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       nullable: true
 *                       example: user123
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/profile",
  authMiddleware,
  UserController.profile,
);

export default router;
