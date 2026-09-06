import type { OrganizationRepository } from "./organization.repository.js";

export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}
}
