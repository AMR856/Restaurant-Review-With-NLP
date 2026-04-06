import express from "express";
import restaurantRouter from "./modules/restaurants/restaurant.route";
import reviewRouter from "./modules/reviews/review.route";
import userRouter from "./modules/users/user.route";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use(express.json());

app.use("/auth", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/reviews", reviewRouter);

app.use(errorHandler);

export default app;
