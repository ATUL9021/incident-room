import type { LoginInput, RegisterInput, Session } from "./auth.types.js";
import { AuthRepository } from "./auth.repository.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../../utils/jwt.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { AppError } from "../../errors/AppError.js";
import { runInTransaction } from "../../database/transaction.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refresh_token.js";

import type { PoolClient } from "pg";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async registerUser({ name, email, password }: RegisterInput): Promise<{
    id: string;
    name: string;
    email: string;
  }> {
    const user = await this.authRepository.findByEmail(email);

    if (user) {
      // user is already exists => so validation failed status code
      throw new AppError(
        409,
        ERROR_CODES.USER_EMAIL_ALREADY_EXISTS,
        "User email already exists",
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await this.authRepository.createUser({
      name: name,
      email: email,
      passwordHash: passwordHash,
    });

    return result!;
  }

  async loginUser({ email, password }: LoginInput) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      //validation falied
      throw new AppError(
        401,
        ERROR_CODES.INVALID_CREDENTIALS,
        "invalid credentials",
      );
    }

    const isMatched = await bcrypt.compare(password, user.password_hash);

    if (!isMatched) {
      //validation failed.
      throw new AppError(
        422,
        ERROR_CODES.INVALID_CREDENTIALS,
        "invalid credentials",
      );
    }

    const accessToken = createAccessToken(user.id);
    const { finalRefreshToken } = await this.createSession(user.id);
    return {
      accessToken,
      finalRefreshToken,
    };
  }

  //it will create new session,
  async createSession(userId: string) {
    //we should use sessionId.refreshToken
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const result = await this.authRepository.createSession(
      userId,
      refreshTokenHash,
      new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRY_IN_MILLIS)),
    );

    const finalRefreshToken = `${result?.id}.${refreshToken}`;
    return { finalRefreshToken, sessionId: result?.id };
  }

  //it will generate new refreh token and jwt token.
  async refreshSession(refreshToken: string) {
    const [sessionId, token] = refreshToken.split(".");
    console.log(sessionId, token);
    if (!sessionId || !token) {
      throw new AppError(
        400,
        ERROR_CODES.REFRESH_TOKEN_INVALID,
        "Refress token is not in correct form",
      );
    }

    const { finalRefreshToken, userId } = await runInTransaction(
      async (repoConection) => {
        let session: Session =
          await repoConection.findSessionByIdWithForUpdate(sessionId);

        if (!session) {
          throw new AppError(
            401,
            ERROR_CODES.REFRESH_TOKEN_INVALID,
            "session for this token doesnt exists",
          );
        }

        if (
          hashRefreshToken(token) !== session.refreshTokenHash ||
          session.revokedAt ||
          session.expiresAt! <= new Date()
        ) {
          throw new AppError(
            401,
            ERROR_CODES.REFRESH_TOKEN_INVALID,
            "Refresh token is invalid or expired or revoked",
          );
        }

        //revoke current session

        await repoConection.revokeSession(session.id);

        //create new sesssion

        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashRefreshToken(refreshToken);
        const result = await repoConection.createSession(
          session.userId,
          refreshTokenHash,
          new Date(
            Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRY_IN_MILLIS),
          ),
        );

        //update replaced by in old session.

        await repoConection.replaceNewSessionInOldSession(
          session.id,
          result.sessionId,
        );

        const finalRefreshToken = `${result?.id}.${refreshToken}`;
        return { finalRefreshToken, userId: session.userId };
      },
    );

    return {
      finalRefreshToken,
      accessToken: createAccessToken(userId),
    };
  }

  //it will revoke the current session.
  async logoutSession(refreshToken: string, userId: string) {
    const [sessionId, token] = refreshToken.split(".");
    if (!sessionId || !token) {
      throw new AppError(
        422,
        ERROR_CODES.REFRESH_TOKEN_INVALID,
        "refresh token is malformed",
      );
    }

    await runInTransaction(async (client) => {
      const session = await client.findSessionByIdWithForUpdate(sessionId);

      if (!session) {
        throw new AppError(
          401,
          ERROR_CODES.REFRESH_TOKEN_INVALID,
          "there is not session with this id",
        );
      }

      if (
        session.refreshTokenHash !== hashRefreshToken(token) ||
        session.revokedAt ||
        session.expiresAt! <= new Date() ||
        session.userId !== userId
      ) {
        console.log(
          session.refreshTokenHash !== hashRefreshToken(refreshToken),
        );
        console.log(session.revokedAt);
        console.log(session.expiresAt! <= new Date());
        console.log(session.userId !== userId);
        throw new AppError(
          401,
          ERROR_CODES.REFRESH_TOKEN_INVALID,
          "Refresh token is invalid",
        );
      }
      await client.revokeSession(sessionId);
    });
  }
}
