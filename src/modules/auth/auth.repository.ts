import type { CreateUserData, Session } from "./auth.types.js";
import { pool } from "../../database/database.js";
import type { Pool, PoolClient } from "pg";
export class AuthRepository {
  constructor(private readonly db: Pool | PoolClient) {}

  async findByEmail(email: string) {
    const result = await this.db.query(
      `
      select * from users 
      where email=$1

      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async createUser(userData: CreateUserData): Promise<{
    id: string;
    name: string;
    email: string;
  } | null> {
    const { name, email, passwordHash } = userData;
    const result = await this.db.query(
      `
      insert into users (name, email,password_hash) values($1,$2,$3)
      RETURNING id,name,email
  
      `,
      [name, email, passwordHash],
    );

    return result?.rows?.at(0) ?? null;
  }

  async createSession(
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
  ) {
    const result = await this.db.query(
      `
      INSERT INTO SESSIONS (user_id, refresh_token_hash,expires_at) VALUES 
      ($1,$2,$3)
      RETURNING id
      `,
      [userId, refreshTokenHash, expiresAt],
    );

    return result.rows[0] ?? null;
  }

  async findSessionByIdWithForUpdate(sessionId: string): Promise<Session> {
    const result = await this.db.query(
      `
        SELECT id,
        user_id AS "userId",
        refresh_token_hash as "refreshTokenHash",
        expires_at as "expiresAt",
        revoked_at as "revokedAt",
        created_at as "createdAt",
        replaced_by_session_id as "replacedBySessionId"
  
        FROM sessions
        WHERE id=$1

        FOR UPDATE;
      `,
      [sessionId],
    );

    return result.rows[0] ?? null;
  }

  async revokeSession(sessionId: string) {
    const result = await this.db.query(
      `
       update sessions
       set revoked_at = NOW()
       where id=$1
       RETURNIN id
      `,
      [sessionId],
    );

    return result.rows[0] ?? null;
  }

  async replaceNewSessionInOldSession(
    sessionId: string,
    replacedBySessionId: string,
  ) {
    const result = await this.db.query(
      `
       update sessions
       set replaced_by_session_id = $1
       where id=$2
      
      `,
      [replacedBySessionId, sessionId],
    );
  }
}
