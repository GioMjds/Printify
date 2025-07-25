export interface Upload {
    id: string;
    filename: string;
    fileData: string;
    status: string;
    rejection_reason: string | null;
    needed_amount: number | null;
    customerId: string;
    format: string;
    createdAt: string;
    updatedAt: string;
}

export interface UploadResponse {
    uploads: Upload[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }
}