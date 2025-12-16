import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Import route modules
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

// Create an Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// ⚡ Enable CORS (Cross-Origin Resource Sharing)
// This allows the API to be accessed from different origins (like a frontend app)
app.use(cors());

// --- Server and Swagger Documentation Setup ---
// Determine PORT and BASE_URL early so Swagger can use the actual base URL
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// swaggerJsdoc generates OpenAPI spec from JSDoc comments in route files
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChainProof API",
      version: "1.0.0",
      description: "API documentation for ChainProof backend",
    },
    servers: [{ url: BASE_URL }], // Base server URL (uses process.env.BASE_URL when available)
  },
  apis: ["./src/routes/*.ts"], // Files containing JSDoc comments for endpoints
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at /swagger endpoint
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API Routes ---
// Root endpoint
app.get("/", (_req, res) => res.send("Welcome to the ChainProof backend service!"));

// Health check route
app.use("/", healthRoute);

// Trace route for logging or monitoring
app.use("/", traceRoute);

// Product-related routes
app.use("/", productsRoute);

// Actor-related routes
app.use("/", actorsRoute);

// Contacts
app.use("/", contactsRoute);

// Product categories
app.use("/", productCategoriesRoute);

// Actor categories
app.use("/", actorCategoriesRoute);

// Units
app.use("/", unitsRoute);

// Product transaction routes
app.use("/api/products", productTransactionsRoute);

// Admin product transactions listing
app.use("/", productTransactionsAdminRoute);

// Transaction routes
app.use("/api/transaction", transactionRoute);

// Start the server
app.listen(PORT, () => console.log(`Backend running on ${BASE_URL}`));
