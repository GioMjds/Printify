export interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
    orderId?: string;
}

export interface NavbarProps {
    userDetails?: {
        profileImage?: string;
        name?: string;
        email?: string;
        role?: string;
        id?: string;
    } | null;
}