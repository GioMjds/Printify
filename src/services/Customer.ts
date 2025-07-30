import { API } from "./_axios";

type PrintUploads = {
    userId: string;
    page?: number;
    limit?: number;
}

export const fetchCustomerProfile = async ({ userId }: PrintUploads) => {
    try {
        const response = await API.get(`/profile/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch customer profile: ${error}`);
        throw error;
    }
};

export const fetchCustomerPrintUploads = async ({ userId, page, limit }: PrintUploads) => {
    try {
        const response = await API.get(`/profile/uploads/${userId}?page=${page}&limit=${limit}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch print uploads for user ${userId}: ${error}`);
        throw error;
    }
};

export const fetchSinglePrintUpload = async ({ uploadId }: { uploadId: string }) => {
    try {
        const response = await API.get(`/profile/upload/${uploadId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch print upload with ID ${uploadId}: ${error}`);
        throw error;
    }
}

export const cancelPrintUpload = async ({ uploadId, cancelReason }: { uploadId: string; cancelReason: string }) => {
    try {
        const response = await API.put(`/profile/upload/${uploadId}`, {
            cancelReason: cancelReason
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to cancel print upload with ID ${uploadId}: ${error}`);
        throw error;
    }
}