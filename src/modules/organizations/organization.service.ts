import type { OrganizationRepository } from "./organization.repository.js";
import { runInTransaction } from "../../database/transaction.js";
import type {
  OrganizationOutput,
  MemberShipRole,
} from "./organization.types.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createOrganization(
    organizationName: string,
    userId: string,
  ): Promise<OrganizationOutput> {
    //standardize the organization name
    organizationName = organizationName.toLowerCase().trim();

    return await runInTransaction(async (unitOfWork) => {
      const organizationOutput =
        await unitOfWork.organizationRepository.createOrganization(
          organizationName,
        );

      const role: MemberShipRole = "owner";

      const memberShipOutput =
        await unitOfWork.organizationRepository.createMemberShipInOrganization(
          organizationOutput.id,
          userId,
          role,
        );

      return organizationOutput;
    });
  }

  async deleteOrganization(organizationid: string, userId: string) {
    const deleted = await this.organizationRepository.deleteOrganizationById(
      organizationid,
      userId,
    );

    if (!deleted) {
      throw new AppError(
        403,
        ERROR_CODES.UNABLE_TO_DELETE_ORGANIZATION,
        "cannot delete organization",
      );
    }

    return deleted;
  }

  async getOrganizationById(organizationId: string, userId: string) {
    const organizationOutput =
      await this.organizationRepository.getOrganizationById(
        organizationId,
        userId,
      );

    if (!organizationOutput) {
      throw new AppError(
        404,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Unable to find the organizations",
      );
    }

    return organizationOutput;
  }

  async getAllOrganizations(userId: string) {
    const organizationOutputs: OrganizationOutput[] =
      await this.organizationRepository.getAllOrganizations(userId);

    return organizationOutputs;
  }

  async discoverAllOrganizationsForJoiningAnUser() {
    const organizationOutputs: OrganizationOutput[] =
      await this.organizationRepository.discoverAllOrganizationsAvailableForJoining();

    return organizationOutputs;
  }
}
