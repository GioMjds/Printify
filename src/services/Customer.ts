import { API } from "./_axios";

type PrintUploads = {
    userId: string;
    page?: number;
    limit?: number;
}

type ChangeProfileProps = {
    userId: string;
    imageData: string;
}

type CancelUpload = {
    uploadId: string;
    cancelReason: string;
}

type ContactForm = {
    name: string;
    email: string;
    subject: string;
    message: string;
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

export const changeProfileImage = async ({ userId, imageData }: ChangeProfileProps) => {
    try {
        const response = await API.put(`/profile/change-profile-image`, {
            userId: userId,
            imageData: imageData
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to change profile image for user ${userId}: ${error}`);
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

export const cancelPrintUpload = async ({ uploadId, cancelReason }: CancelUpload) => {
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
};

export const sendContactForm = async ({ name, email, subject, message }: ContactForm) => {
    try {
        const response = await API.post('/contact', {
            name: name,
            email: email,
            subject: subject,
            message: message
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to send contact form: ${error}`);
        throw error;
    }
}