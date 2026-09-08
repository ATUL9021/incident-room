import type { PoolClient } from "pg";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { OrganizationRepository } from "../modules/organizations/organization.repository.js";
import { JoinRequestsRepository } from "../modules/join-requests/join_requests.repository.js";
import { MembershipsRepository } from "../modules/memberships/memberships.repository.js";
export class UnitOfWork {
  readonly authRepository;
  readonly organizationRepository;
  readonly joinRequestsRepository;
  readonly membershipRepository;
  constructor(client: PoolClient) {
    this.authRepository = new AuthRepository(client);
    this.organizationRepository = new OrganizationRepository(client);
    this.joinRequestsRepository = new JoinRequestsRepository(client);
    this.membershipRepository = new MembershipsRepository(client);
  }
}
