export interface JoinRequestsOutput {
  id: string;
  createdAt: string;
  userId: string;
  organizationId: string;
  status: "pending" | "accepted" | "declined";
}
