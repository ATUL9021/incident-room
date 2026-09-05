import type { PoolClient } from "pg";
import { pool } from "./database.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";

export async function runInTransaction<T>(
  callback: (client: AuthRepository) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  const authRepository = new AuthRepository(client);
  try {
    await client.query(`BEGIN`);
    const result = await callback(authRepository);
    await client.query(`COMMIT`);

    return result;
  } catch (error) {
    await client.query(`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
}
