import type { Response, Request } from "express";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.types.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // private readonly authService = new AuthService(new AuthRepository());

  async register(req: Request, res: Response) {
    const { name, email, password }: RegisterInput = req.body;

    const user = await this.authService.registerUser({
      name,
      email: email.trim().toLowerCase(),
      password,
    });

    return res.status(201).send(user);
  }

  async login(req: Request, res: Response) {
    const loginInput: LoginInput = req.body;

    const { finalRefreshToken, accessToken } =
      await this.authService.loginUser(loginInput);

    res.cookie("refreshToken", finalRefreshToken, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/api/auth",
    });

    res.status(200).json({ accessToken });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.userId;
    const { finalRefreshToken: newRefreshToken, accessToken } =
      await this.authService.refreshSession(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/api/auth",
    });

    return res.status(200).send({
      accessToken,
    });

    //we have refresh token and new jwt now.
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.userId;
    await this.authService.logoutSession(refreshToken, userId!);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      path: "/api/auth",
      // secure: true,
    });
    res.status(200).send({
      message: "log out successful",
    });
  }
}
