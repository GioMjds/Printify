export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export enum UploadStatus {
  PENDING = "pending",
  PRINTING = "printing",
  CANCELLED = "cancelled",
  READY_TO_PICKUP = "ready_to_pickup",
  COMPLETED = "completed",
}

export interface User {
  id: string;
  email: string;
  password: string;
  profile_image?: string | null;
  name?: string | null;
  role: UserRole;
  isVerified?: boolean | null;
  uploads: Upload[];
  createdAt: string;
  updatedAt: string;
}

export interface Upload {
  id: string;
  filename: string;
  fileData: string;
  status: UploadStatus;
  customer: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  upload: Upload;
  uploadId: string;
  sentAt: string;
  message: string;
}
