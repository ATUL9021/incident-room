import type { OrganizationService } from "./organization.service.js";
import type { Request, Response, NextFunction } from "express";
import { createOrganizationSchema } from "./organization.validation.js";
import { z } from "zod";
import type { OrganizationOutput } from "./organization.types.js";
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const organizationName: string = req.body.name;

    const organizationOutput =
      await this.organizationService.createOrganization(
        organizationName,
        req.userId!,
      );

    return res.status(201).send(organizationOutput);
  };

  discover = async (req: Request, res: Response, next: NextFunction) => {
    const organizationOutputs: OrganizationOutput[] =
      await this.organizationService.discoverAllOrganizationsForJoiningAnUser();

    return res.status(200).send(organizationOutputs);
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;

    const organizationOutput =
      await this.organizationService.getOrganizationById(
        organizationId,
        req.userId!,
      );

    return res.status(200).send(organizationOutput);
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const organizationOutputs: OrganizationOutput[] =
      await this.organizationService.getAllOrganizations(req.userId!);

    return res.status(200).send(organizationOutputs);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId as string;

    const deleted = await this.organizationService.deleteOrganization(
      organizationId,
      req.userId!,
    );

    res.status(204).send();
  };
}
