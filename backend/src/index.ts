// Import express and the Request and Response types
import express, { Request, Response } from 'express'

// Import swagger-ui-express to serve the Swagger UI
import swaggerUi from 'swagger-ui-express'

// Import swagger-jsdoc to generate Swagger documentation from comments
import swaggerJsdoc from 'swagger-jsdoc'

// Create the Express application
const app = express();

// Set the server port (default 5000, or from environment variable)
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root route ("/") that sends a simple welcome message
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the ChainProof backend service!');
});

// ------------------------
// Swagger configuration
// ------------------------

// Options for swagger-jsdoc
const swaggerOptions = {
  definition: {              // Main API definition
    openapi: '3.0.0',        // OpenAPI version
    info: {                  // API information
      title: 'ChainProof API',
      version: '1.0.0',
      description: 'API documentation for ChainProof backend',
    },
    servers: [
      { url: 'http://localhost:5000' } // Server URL for Swagger
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to route files containing Swagger comments
};

// Generate the Swagger specification from the options
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Create the "/api-docs" route to serve Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ------------------------
// Import routes
// ------------------------

// Example: import the health route
import healthRoute from './routes/health'

// Mount the route under the "/api" prefix, e.g., "/api/health"
app.use('/', healthRoute);

// ------------------------
// Start the server
// ------------------------

// Start listening on the defined port and log the server URL
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
