import express from "express";
import "dotenv/config";
import authRouter from "./modules/auth/auth.routes.js";
import organizationRouter from "./modules/organizations/organization.routes.js";
import joinRequestRouter from "./modules/join-requests/join_requests.routes.js";
import { errorHandler } from "./middleware/error_handler.middlwre.js";
import { pool } from "./database/database.js";
import { authenticate } from "./middleware/auth.middlware.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/organizations", organizationRouter);
app.use("/organizations", joinRequestRouter);
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

  await pool.query(`
      CREATE TABLE IF NOT EXISTS ORGANIZATIONS(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      
      )
    `);

  await pool.query(`
    
    CREATE TABLE IF NOT EXISTS MEMBERSHIPS(
      
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id)
      ON DELETE CASCADE,
      organization_id UUID NOT NULL REFERENCES organizations(id)
      ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('owner', 'admin','member' ,'incident_commander')),
      joined_at NOT NULL TIMESTAMPTZ DEFAULT NOW(),


      CONSTRAINT unique_membership
      UNIQUE(user_id,organization_id)

    )
    
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS join_request(
    id UUId NOT NULL DEFAULT gen_random_uuid(),
    user_id NOT NULL UUID REFERENCES users(id)
    ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id)
    ON DELETE CASCADE,

    status TEXT NOT NULL DEFAULT 'pending'
    check (status IN ('pending', 'declined' , 'accepted')),

    created_at NOT NULL TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_userId_orgId
    unique(user_id, organization_id);
    
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
