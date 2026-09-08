import type { Pool, PoolClient } from "pg";
import type { MemberShipOutput, MemberShipRole } from "./memberships.types.js";

export class MembershipsRepository {
  constructor(private readonly db: Pool | PoolClient) {}

  async getMemberById(
    organizationId: string,
    userIdOfWhoNeedsdata: string,
    userId: string,
  ): Promise<MemberShipOutput> {
    const result = await this.db.query(
      `
      SELECT id,organization_id AS "organizationId" , user_id AS "userId",role,joined_at AS "joinedAt" FROM memberships
      where (user_id=$1 and organization_id=$3) and  (user_id=$2 OR EXISTS
      (SELECT 1 from memberships
      where user_id=$2 and organization_id=$3 
      and  (role='owner' or role='admin')
    ) )
      `,
      [userId, userIdOfWhoNeedsdata, organizationId],
    );

    return result.rows[0];
  }

  async getAllMembers(
    organizationId: string,
    userId: string,
  ): Promise<MemberShipOutput[]> {
    const result = await this.db.query(
      `
      SELECT id,organization_id AS "organizationId" , user_id AS "userId",role,joined_at AS "joinedAt" FROM memberships
      WHERE EXISTS(select 1 from memberships
      where organization_id=$2 and user_id=$1 and role IN ('owner', 'admin')
      )
      `,
      [userId, organizationId],
    );

    return result.rows;
  }

  async updateMemberShipStatus(
    organiztionId: string,
    UserIdOfOwnerOrAdmin: string,
    userId: string,
    newRole: MemberShipRole,
  ): Promise<MemberShipOutput> {
    const result = await this.db.query(
      `
      UPDATE memberships
      SET role=$4
      WHERE (user_id=$1 and organization_id=$2 and role IN('admin' , 'member') and EXISTS(select 1 from memberships
      where organization_id=$2 and user_id=$3 and role IN ('owner')
    )) OR (user_id=$1 and organization_id=$2 and role='member' and $4!='owner' and EXISTS(select 1 from memberships
      where organization_id=$2 and user_id=$3 and role ='admin'  )
      RETURNING id,organization_id AS "organizationId" , user_id AS "userId",role,joined_at AS "joinedAt"
      `,
      [userId, organiztionId, UserIdOfOwnerOrAdmin, newRole],
    );

    return result.rows[0];
  }

  async deleteMemebership(
    organizationId: string,
    UserIdOfOwnerOrAdmin: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.db.query(
      `
      DELETE FROM memberships
      WHERE (user_id=$1 and organization_id=$2 and role IN ('admin','member') and EXISTS(select 1 from memberships
      WHERE organization_id=$2 and user_id=$3 and role IN ('owner')
    )) OR(user_id=$1 and organization_id=$2 and role='member'and EXISTS(select 1 from memberships
      WHERE organization_id=$2 and user_id=$3 and role ='admin' )

      
        
        
        `,
      [userId, organizationId, UserIdOfOwnerOrAdmin],
    );

    return result.rowCount === 1;
  }

  async createMembership(
    organizationId: string,
    userId: string,
    role: string,
  ): Promise<MemberShipOutput> {
    const result = await this.db.query(
      `
      
      
      INSERT INTO MEMBERSHIPS (

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
