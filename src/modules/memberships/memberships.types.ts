export interface MemberShipOutput {
  id: string;
  joinedAt: Date;
  userId: string;
  organizationId: string;
  role: string;
}

export type MemberShipRole = "owner" | "admin" | "member";
