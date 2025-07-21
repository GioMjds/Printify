// orders.tsx
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