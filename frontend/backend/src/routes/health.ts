import { Router, Request, Response } from 'express'

// Create a router instance
const router = Router()

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check if API is running
 *     description: Simple endpoint to verify the backend is working
 *     responses:
 *       200:
 *         description: API is healthy and running
 */
router.get('/health', (req: Request, res: Response) => {
  // Send a JSON response indicating the API is healthy
  res.status(200).json({ status: 'OK' })
})

// Export the router to be used in index.ts
export default router
