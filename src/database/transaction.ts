import type { PoolClient } from "pg";
import { pool } from "./database.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { UnitOfWork } from "./unit_of_work.js";
export async function runInTransaction<T>(
  callback: (unitOfWork: UnitOfWork) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  const unitOfWork = new UnitOfWork(client);
  try {
    await client.query(`BEGIN`);
    const result = await callback(unitOfWork);
    await client.query(`COMMIT`);

    return result;
  } catch (error) {
    await client.query(`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
}
