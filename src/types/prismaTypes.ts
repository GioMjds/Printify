// Types generated based on prisma schema.prisma

export type UserRole = "customer" | "admin";

export type UploadStatus =
  | "pending"
  | "printing"
  | "cancelled"
  | "ready_to_pickup"
  | "completed";

export interface User {
  id: string;
  email: string;
  password: string;
  profile_image?: string | null;
  name?: string | null;
  role: UserRole;
  isVerified?: boolean | null;
  uploads: Upload[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Upload {
  id: string;
  filename: string;
  fileData: string;
  status: UploadStatus;
  customer: string;
  customerId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  notifications: Notification[];
}

export interface Notification {
  id: string;
  upload: Upload;
  uploadId: string;
  sentAt: string; // ISO string
  message: string;
}
