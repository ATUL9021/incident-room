export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt?: Date;
  revokedAt?: Date;
  createdAt?: Date;
  replacedBySessionId?: string;
}
