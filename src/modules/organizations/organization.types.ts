export interface OrganizationOutput {
  createdAt: Date;
  name: string;
  id: string;
}

export interface MemberShipOutput {
  id: string;
  joinedAt: Date;
  userId: string;
  organizationId: string;
  role: string;
}

export type MemberShipRole =
  | "owner"
  | "admin"
  | "incident_commander"
  | "member";
