import { Pool, QueryResultRow } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from the parent folder's .env file
// Choose env file: use .env.local for local npm runs, .env for docker-compose
function resolveEnvPath() {
  const repoRoot = path.resolve(__dirname, "../../");
  const envLocal = path.join(repoRoot, ".env.local");
  const envDefault = path.join(repoRoot, ".env");
  const inDocker = !!process.env.DOCKER || fs.existsSync("/.dockerenv");
  if (!inDocker && fs.existsSync(envLocal)) return envLocal;
  return envDefault;
}

dotenv.config({ path: resolveEnvPath() });

// Create a new PostgreSQL connection pool using environment variables
export const pool = new Pool({
  host: process.env.DB_HOST,                  // Database host
  port: Number(process.env.DB_PORT_OUT || 5432),  // Database port (default 5432)
  database: process.env.DB_NAME,              // Database name
  user: process.env.DB_USER,                  // Database username
  password: process.env.DB_PASS,              // Database password
});

/**
 * Typed query helper function.
 * T extends QueryResultRow (constraint expected by pg library).
 *
 * @param text - SQL query string
 * @param params - Optional array of query parameters
 * @returns Promise resolving to an array of rows of type T
 */
export async function q<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const { rows } = await pool.query<T>(text, params); // Execute query and extract rows
  return rows; // Return only the rows
}
