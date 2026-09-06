import type { JoinRequestsService } from "./join_requests.service.js";
import type { Request, Response, NextFunction } from "express";
export class JoinRequestsController {
  constructor(private readonly joinRequestsService: JoinRequestsService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.userId!;
    const joinRequestOuptut =
      await this.joinRequestsService.createJoiningRequest(
        userId,
        organizationId,
      );

    res.status(201).send(joinRequestOuptut);
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.userId!;
    const joinRequestOuptuts =
      await this.joinRequestsService.getAllJoiningRequests(userId);

    res.status(200).send(joinRequestOuptuts);
  };
  get = async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.requestId as string;
    const userId = req.userId!;
    const joinRequestOuptut =
      await this.joinRequestsService.getJoiningRequestById(userId, requestId);

    res.status(200).send(joinRequestOuptut);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.requestId as string;
    const userId = req.userId!;
    const deleted = await this.joinRequestsService.deleteJoiningRequest(
      userId,
      requestId,
    );

    res.status(204).send();
  };
}
