import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Routes
import healthRoute from "./routes/health";
import traceRoute from "./routes/trace";

const app = express();
app.use(express.json());

// --- Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChainProof API",
      version: "1.0.0",
      description: "API documentation for ChainProof backend",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  // IMPORTANT : chemin des fichiers avec commentaires OpenAPI (dont health.ts)
  apis: ["./src/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.get("/", (_req, res) =>
  res.send("Welcome to the ChainProof backend service!")
);
app.use("/", healthRoute);
app.use("/", traceRoute);

// --- Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
