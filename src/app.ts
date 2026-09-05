import express from "express";
import "dotenv/config";
import authRouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error_handler.middlwre.js";
import { pool } from "./database/database.js";
import { authenticate } from "./middleware/auth.middlware.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use(errorHandler);

async function initializeDatabase() {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS USERS(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()    
        )
        `);

  await pool.query(`
    
       CREATE TABLE IF NOT EXISTS SESSIONS(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        refresh_token_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        replaced_by_session_id UUID ,




        CONSTRAINT fk_replaced_by_session_id
          FOREIGN KEY (replaced_by_session_id)
          REFERENCES sessions(id),

        
        CONSTRAINT fk_sessions_user
          FOREIGN KEY (user_id)
          REFERENCES users(id) 
          ON DELETE CASCADE
       
       )
    
    `);

  console.log("database initialized");
}
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(3000);
    console.log("server started");
  } catch (error) {
    console.log(error);
  }
}

startServer();
