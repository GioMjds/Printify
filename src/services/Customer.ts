import { API } from "./_axios";

export const fetchCustomerProfile = async ({ userId }: { userId: string }) => {
    try {
        const response = await API.get(`/profile/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch customer profile:", error);
        throw error;
    }
};