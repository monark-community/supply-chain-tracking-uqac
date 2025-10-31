import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import healthRoute from "./routes/health";
import traceRoute from "./routes/trace";
import productsRoute from "./routes/products";
import actorsRoute from "./routes/actors";
import productTransactionsRoute from "./routes/productTransactions";
import transactionRoute from "./routes/transaction";

const app = express();
app.use(express.json());

// ⚡ Activer CORS
app.use(cors());

// --- Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "ChainProof API", version: "1.0.0", description: "API documentation for ChainProof backend" },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.get("/", (_req, res) => res.send("Welcome to the ChainProof backend service!"));
app.use("/", healthRoute);
app.use("/", traceRoute);
app.use("/", productsRoute);
app.use("/", actorsRoute);
app.use("/api/products", productTransactionsRoute);
app.use("/api/transaction", transactionRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
