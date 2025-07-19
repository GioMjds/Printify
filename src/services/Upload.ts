import { API } from "./_axios";

export const uploadFile = async (formData: FormData) => {
    try {
        const response = await API.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to upload file: ${error}`);
        throw error;
    }
}

export function getDownloadUrl(uploadId: string): string {
    return `/api/download/${uploadId}`;
}

export async function confirmPrintOrder(uploadId: string): Promise<void> {
    try {
        const res = await API.post(`/upload/${uploadId}/confirm`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error(`Failed to confirm print order: ${error}`);
        throw error;
    }
}