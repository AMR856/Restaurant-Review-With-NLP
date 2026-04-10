import app from "./app";
import { ReviewQueueService } from "./modules/reviews/review.queue";

const port = Number(process.env.PORT ?? 3000);

async function bootstrap() {
	await ReviewQueueService.startWorker();

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
}

bootstrap().catch((error) => {
	console.error("Failed to start reviews API service:", error);
	process.exit(1);
});
