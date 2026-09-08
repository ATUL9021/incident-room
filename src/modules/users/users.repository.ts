import type { Pool, PoolClient } from "pg";
import type { UserOutput } from "./users.types.js";

export class UserRepository {
  constructor(private readonly db: Pool | PoolClient) {}

  async getUser(userId: string): Promise<UserOutput> {
    const result = await this.db.query(
      `
        SELECT name,email FROM users
        where id=$1
        
        `,
      [userId],
    );

    return result.rows[0];
  }

  async updateUserInfo(
    userId: string,
    info: { name: string },
  ): Promise<UserOutput> {
    const result = await this.db.query(
      `
        UPDATE users
        set name=$2
        where id=$1
        RETURNING name,emal
        `,
      [userId, info.name],
    );

    return result.rows[0];
  }
}
