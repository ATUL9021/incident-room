import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import type { UserRepository } from "./users.repository.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUser(userId: string) {
    const user = await this.userRepository.getUser(userId);

    if (!user) {
      new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED_REQUEST,
        "unauthorized request",
      );
    }

    return user;
  }

  async updateUserInfo(userId: string, info: { name: string }) {
    const user = await this.userRepository.updateUserInfo(userId, info);

    if (!user) {
      new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED_REQUEST,
        "unauthorized request",
      );
    }

    return user;
  }
}
