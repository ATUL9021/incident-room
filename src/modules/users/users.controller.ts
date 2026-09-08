import type { UserService } from "./users.service.js";
import type { Request, Response, NextFunction } from "express";

export class UserController {
  constructor(private readonly userService: UserService) {}
  get = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const user = await this.userService.getUser(userId);

    return res.status(200).send(user);
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const name = req.body.name;

    const user = await this.userService.updateUserInfo(userId, { name });
    return user;
  };
}
