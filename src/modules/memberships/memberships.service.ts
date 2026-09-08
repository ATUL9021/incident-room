import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import type { MembershipsRepository } from "./memberships.repository.js";
import type { MemberShipOutput, MemberShipRole } from "./memberships.types.js";

export class MembershipsService {
  constructor(private readonly membershipsRepository: MembershipsRepository) {}

  async getAllMembers(organizationId: string, userId: string) {
    const membershipOutputs = this.membershipsRepository.getAllMembers(
      organizationId,
      userId,
    );

    return membershipOutputs;
  }

  async getMemberById(
    organizationId: string,
    userIdOfWhoNeedsdata: string,
    userId: string,
  ) {
    const membershipOutput = this.membershipsRepository.getMemberById(
      organizationId,
      userIdOfWhoNeedsdata,
      userId,
    );

    if (!membershipOutput) {
      throw new AppError(
        404,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Unable to find the membership",
      );
    }

    return membershipOutput;
  }

  async updateMembershipStatus(
    organizationId: string,
    UserIdOfOwnerOrAdmin: string,
    userId: string,
    newRole: MemberShipRole,
  ) {
    const membershipOutput = this.membershipsRepository.updateMemberShipStatus(
      organizationId,
      UserIdOfOwnerOrAdmin,
      userId,
      newRole,
    );

    if (!membershipOutput) {
      throw new AppError(
        403,
        ERROR_CODES.UNAUTHORIZED_REQUEST,
        "Unable to update membership status",
      );
    }

    return membershipOutput;
  }

  async deleteMemebership(
    organizationId: string,
    UserIdOfOwnerOrAdmin: string,
    userId: string,
  ) {
    const isDeleted = this.membershipsRepository.deleteMemebership(
      organizationId,
      UserIdOfOwnerOrAdmin,
      userId,
    );

    if (!isDeleted) {
      throw new AppError(
        403,
        ERROR_CODES.UNAUTHORIZED_REQUEST,
        "Unable to delete",
      );
    }

    return isDeleted;
  }
}
