export type PrintOrder = {
  id: string;
  filename: string;
  fileData: string;
  status: string;
  needed_amount?: number;
  customer?: {
    name?: string;
    id?: string;
  };
  createdAt: string;
  updatedAt: string;
  format: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export type UpdateStatusParams = {
  uploadId: string;
  newStatus: string;
  rejectionReason?: string;
  amount?: number;
};

export interface Staff {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export type UploadID = {
  uploadId: string;
};

export type UploadStatusUpdate = {
  uploadId: string;
  newStatus: string;
  rejectionReason?: string;
  amount?: number;
};

export type DashboardMonthPick = {
  month?: number;
  year?: number;
};

export type NewStaff = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export type UpdateStaff = {
  staffId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
};

export type AddExpense = {
    expenseName: string;
    amount: number;
    category: string;
    description?: string;
    occuredAt: string;
}

export type Expense = {
    id: string | number;
    expenseName: string;
    amount: number;
    category: string;
    description?: string;
    occuredAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export type ExpenseResponse = {
  expenses: Expense[];
}

export type ExpenseFormData = {
    expenseName: string;
    amount: number;
    category: string;
    description?: string;
    occuredAt: string;
};

export type AddStaffFormData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type StaffFormData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
}