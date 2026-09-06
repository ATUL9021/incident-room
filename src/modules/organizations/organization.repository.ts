import type { Pool, PoolClient } from "pg";
import type {
  MemberShipOutput,
  OrganizationOutput,
} from "./organization.types.js";
export class OrganizationRepository {
  constructor(private readonly db: Pool | PoolClient) {}

  async createOrganization(
    organizationName: string,
  ): Promise<OrganizationOutput> {
    const result = await this.db.query(
      `
      INSERT INTO organizations(name)
      VALUES ($1)
      RETURNING id,name,created_at AS "createdAt"
      `,
      [organizationName],
    );

    return result.rows[0];
  }

  async deleteOrganizationById(
    organizationId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.db.query(
      `
    DELETE FROM organizations o 
    WHERE o.id = $1 and EXISTS( 
    SELECT m.id FROM memeberships m
    where m.user_id=$2 and m.organization_id=$1 and role='owner'
    
    )  
      `,
      [organizationId, userId],
    );

    return result.rowCount == 1;
  }

  async getOrganizationById(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationOutput> {
    const result = await this.db.query(
      `
    SELECT o.id,o.name,o.created_at AS "createdAt" FROM organizations o 
    JOIN memberships m ON (o.id = m.organization_id)
    where m.user_id = $1 and m.organizationId=$2
      
      `,
      [userId, organizationId],
    );

    return result.rows[0];
  }

  async getAllOrganizations(userId: string): Promise<OrganizationOutput[]> {
    const result = await this.db.query(
      `
    SELECT o.id,o.name,o.created_at AS "createdAt" FROM organizations o 
    JOIN memberships m ON (o.id = m.organization_id)
    where m.user_id = $1
      `,
      [userId],
    );

    return result.rows;
  }

  async createMemberShipInOrganization(
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
