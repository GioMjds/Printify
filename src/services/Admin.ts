import { API } from "./_axios";

type AdminAccountAction = {
    uploadId: string;
}

type UploadID = {
    uploadId: string;
}

export const fetchAllPrintOrders = async () => {
    try {
        const response = await API.get('/admin/fetch_print_orders', {
            params: { action: 'fetch_print_orders' },
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch print orders: ${error}`);
        throw error;
    }
};

export const fetchPrintOrder = async ({ uploadId }: UploadID ) => {
    try {
        const response = await API.get(`/admin/upload/${uploadId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch print order: ${error}`);
        throw error;
    }
};

// Admin actions can be extended here
export const adminAccount = async ({ uploadId }: AdminAccountAction) => {
    try {
        const response = await API.get(`/admin/upload/${uploadId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to perform admin action: ${error}`);
        throw error;
    }
};