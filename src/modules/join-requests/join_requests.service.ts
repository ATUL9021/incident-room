import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import type { JoinRequestsRepository } from "./join_requests.repository.js";
import type { JoinRequestsOutput } from "./join_requests.types.js";
export class JoinRequestsService {
  constructor(
    private readonly joinRequestsRepository: JoinRequestsRepository,
  ) {}

  async createJoiningRequest(userId: string, organizationId: string) {
    const joinRequestOutput = this.joinRequestsRepository.createJoiningRequest(
      userId,
      organizationId,
    );

    if (!joinRequestOutput) {
      throw new AppError(
        402,
        ERROR_CODES.UNABLE_TO_CREATE_JOIN_REQUEST,
        "cannot create joining request",
      );
    }

    return joinRequestOutput;
  }

  async deleteJoiningRequest(userId: string, requestId: string) {
    const isDeleted = this.joinRequestsRepository.deleteJoiningRequest(
      userId,
      requestId,
    );

    if (!isDeleted) {
      throw new AppError(
        402,
        ERROR_CODES.UNABLE_TO_DELETE_JOIN_REQUEST,
        "cannot DELETE joining request",
      );
    }

    return isDeleted;
  }

  async getAllJoiningRequests(userId: string) {
    const joinRequestOutputs: JoinRequestsOutput[] =
      await this.joinRequestsRepository.getAllJoiningRequests(userId);

    return joinRequestOutputs;
  }

  async getJoiningRequestById(userId: string, requestId: string) {
    const joinRequestOutput =
      await this.joinRequestsRepository.getJoiningRequestById(
        userId,
        requestId,
      );

    if (!joinRequestOutput) {
      throw new AppError(
        402,
        ERROR_CODES.UNABLE_TO_GET_JOIN_REQUEST,
        "cannot create joining request",
      );
    }

    return joinRequestOutput;
  }
}
