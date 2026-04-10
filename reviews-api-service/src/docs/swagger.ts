import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const port = Number(process.env.PORT ?? 3000);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reviews API",
      version: "1.0.0",
      description: "API documentation for the reviews API service.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: [path.join(process.cwd(), "src/modules/**/*.ts")],
};

export const swaggerSpec = swaggerJSDoc(options);
