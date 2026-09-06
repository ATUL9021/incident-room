import type { OrganizationService } from "./organization.service.js";
import type { Request, Response, NextFunction } from "express";
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {};

  getById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.organizationId;
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {};

  delete = async (req: Request, res: Response, next: NextFunction) => {};
}
