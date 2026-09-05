import jwt, { type JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
export function createAccessToken(id: string) {
  return jwt.sign({ subject: id, expiresIn: "15m" }, jwtSecret as string);
}

export function verifyAccessToken(accessToken: string): JwtPayload | string {
  return jwt.verify(accessToken, jwtSecret as string);
}
