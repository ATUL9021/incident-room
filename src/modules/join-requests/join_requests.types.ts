export interface JoinRequestsOutput {
  id: string;
  createdAt: string;
  userId: string;
  organizationId: string;
  status: JoinRequestStatus;
}

export type JoinRequestStatus = "pending" | "accepted" | "declined";
