import type { PoolClient } from "pg";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { OrganizationRepository } from "../modules/organizations/organization.repository.js";

export class UnitOfWork {
  readonly authRepository;
  readonly organizationRepository;

  constructor(client: PoolClient) {
    this.authRepository = new AuthRepository(client);
    this.organizationRepository = new OrganizationRepository(client);
  }
}
