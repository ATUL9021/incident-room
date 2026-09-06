import type { Pool, PoolClient } from "pg";
import type { JoinRequestsOutput } from "./join_requests.types.js";

export class JoinRequestsRepository {
  constructor(private readonly db: Pool | PoolClient) {}

  //admin can transition joining status from pending to accepted, or pending to declined  , or declined to accepted
  //a user can only make one joining request to one organization
  async createJoiningRequest(
    userId: string,
    organizationId: string,
  ): Promise<JoinRequestsOutput> {
    const result = await this.db.query(
      `
      INSERT INTO VALUES join_requests(user_id,organization_id)
      VALUES ($1,$2)
      RETURNING id,user_id AS 'userId',organization_id AS 'organizationId',created_at AS 'createdAt',status
      `,
      [userId, organizationId],
    );

    return result.rows[0];
  }

  async deleteJoiningRequest(
    userId: string,
    requestId: string,
  ): Promise<boolean> {
    const result = await this.db.query(
      `
    DELETE FROM join_requests
    where id=$1 and status='pending' and user_id=$2
    `,
      [requestId, userId],
    );

    return result.rowCount == 1;
  }

  async getAllJoiningRequests(userId: string) {
    const result = await this.db.query(
      `
      SELECT id,user_id AS 'userId',organization_id AS 'organizationId',created_at AS 'createdAt',status FROM
      join_requests
      WHERE user_id=$1 

      `,
      [userId],
    );

    return result.rows;
  }

  async getJoiningRequestById(userId: string, requestId: string) {
    const result = await this.db.query(
      `
      SELECT id,user_id AS 'userId',organization_id AS 'organizationId',created_at AS 'createdAt',status FROM
      join_requests
      WHERE user_id=$1 and requestId=$2
      `,
      [userId, requestId],
    );

    return result.rows[0];
  }
}
