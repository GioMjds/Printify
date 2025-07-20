import { API } from "./_axios";

type PrintUploads = {
    userId: string;
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

export const fetchCustomerPrintUploads = async ({ userId }: PrintUploads) => {
    try {
        const response = await API.get(`/profile/uploads/${userId}`, {
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