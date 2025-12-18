import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Routes
import healthRoute from "./routes/health";
import traceRoute from "./routes/trace";
import productsRoute from "./routes/products";
import actorsRoute from "./routes/actors";
import productTransactionsRoute from "./routes/productTransactions";
import transactionRoute from "./routes/transaction";
import contactsRoute from "./routes/contacts";
import productCategoriesRoute from "./routes/productCategories";
import actorCategoriesRoute from "./routes/actorCategories";
import unitsRoute from "./routes/units";
import productTransactionsAdminRoute from "./routes/productTransactionsAdmin";

// Create Express app
const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS (frontend → backend)
app.use(cors());

// Server config
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

// Swagger / OpenAPI configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChainProof API",
      version: "1.0.0",
      description: "Backend API for ChainProof",
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

// Generate OpenAPI spec
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get("/", (_req, res) => {
  res.send("ChainProof backend is running");
});

// Health check
app.use("/", healthRoute);

// Trace / logging
app.use("/", traceRoute);

// Business routes
app.use("/", productsRoute);
app.use("/", actorsRoute);
app.use("/", contactsRoute);
app.use("/", productCategoriesRoute);
app.use("/", actorCategoriesRoute);
app.use("/", unitsRoute);

// Product transactions
app.use("/api/products", productTransactionsRoute);

// Admin routes
app.use("/", productTransactionsAdminRoute);

// Transactions
app.use("/api/transaction", transactionRoute);

// Start server (Render requires 0.0.0.0)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on ${BASE_URL}`);
});
