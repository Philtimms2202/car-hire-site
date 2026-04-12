import dotenv from "dotenv"
import path from "path"

// Load .env.local BEFORE anything else
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })