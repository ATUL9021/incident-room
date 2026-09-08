import type { Pool, PoolClient } from "pg";
import type {
  JoinRequestsOutput,
  JoinRequestStatus,
} from "./join_requests.types.js";

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

  async updateJoiningRequest(
    userId: string,
    requestId: string,
    status: JoinRequestStatus,
  ): Promise<JoinRequestsOutput> {
    const result = await this.db.query(
      `
      UPDATE join_requests j
      SET status=$2
      where j.id=$1  and j.status!=$2 and j.status IN ('pending', 'declined') and EXISTS(
        SELECT 1 FROM memberships m
        where m.user_id=$3 and m.role='owner' and m.organization_id=j.organization_id
      )
      RETURNING j.id,j.user_id AS 'userId',j.organization_id AS 'organizationId',j.created_at AS 'createdAt',j.status

      `,
      [requestId, status, userId],
    );

    return result.rows[0];
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

  async createMembership(organizationId: string, userId: string, role: string) {
    const result = await this.db.query(
      `
        
        
        INSERT INTO memberships (
  
          organization_id,
          user_id,
          role
          
        ) 
        VALUES($1,$2,$3)
        RETURNING id,organization_id AS "organizationId" , user_id AS "userId",role,joined_at AS "joinedAt";
        
      `,
      [organizationId, userId, role],
    );

    return result.rows[0];
  }
}
