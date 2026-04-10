import express from "express";
require('dotenv').config();
import swaggerUi from "swagger-ui-express";
import restaurantRouter from "./modules/restaurants/restaurant.route";
import reviewRouter from "./modules/reviews/review.route";
import userRouter from "./modules/users/user.route";
import { swaggerSpec } from "./docs/swagger";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use(express.json());

// app.get("/api-docs.json", (_req, res) => {
// 	res.setHeader("Content-Type", "application/json");
// 	res.send(swaggerSpec);
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/reviews", reviewRouter);

app.use(errorHandler);

export default app;
