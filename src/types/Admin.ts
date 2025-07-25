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