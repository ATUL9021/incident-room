import type { Pool, PoolClient } from "pg";
import type { OrganizationOutput } from "./organization.types.js";

import type { MemberShipOutput } from "../memberships/memberships.types.js";
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

  async discoverAllOrganizationsAvailableForJoining(): Promise<
    OrganizationOutput[]
  > {
    const result = await this.db.query(
      `
    SELECT o.id,o.name,o.created_at AS "createdAt" FROM organizations o 
    
      `,
    );

    return result.rows;
  }
}
