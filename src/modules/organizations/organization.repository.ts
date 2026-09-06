import type { Pool, PoolClient } from "pg";

export class OrganizationRepository {
  constructor(private readonly db: Pool | PoolClient) {}
}
