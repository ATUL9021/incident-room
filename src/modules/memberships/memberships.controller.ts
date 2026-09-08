import type { MembershipsService } from "./memberships.service.js";
import type { Request, Response, NextFunction } from "express";

export class MemebershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.userId!;
    const membershipOutputs = await this.membershipsService.getAllMembers(
      organizationId,
      userId,
    );

    return res.status(200).send(membershipOutputs);
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;
    const userIdOfOwnerOrAdminOrItself = req.userId!;
    const userId = req.params.userId as string;
    const membershipOutput = await this.membershipsService.getMemberById(
      organizationId,
      userIdOfOwnerOrAdminOrItself,
      userId,
    );

    return res.status(200).send(membershipOutput);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;
    const userIdOfOwnerOrAdminOrItself = req.userId!;
    const userId = req.params.userId as string;
    const membershipOutput = await this.membershipsService.getMemberById(
      organizationId,
      userIdOfOwnerOrAdminOrItself,
      userId,
    );

    return res.status(200).send(membershipOutput);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {};
}
