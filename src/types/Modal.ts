export interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title: string;
    description?: string;
    reasonLabel?: string;
    reasonPlaceholder?: string;
    confirmButtonText?: string;
    showPolicyNote?: boolean;
    reasons?: string[];
}

// PrintOrderModal.tsx
export interface PrintOrderModalProps {
    order: {
        id: string;
        filename: string;
        fileData: string;
        status: string;
        needed_amount?: number;
        customer?: { name?: string; id?: string };
        createdAt: string;
        updatedAt: string;
        format: string;
    };
    onClose: () => void;
    onReject: (orderId: string, reason: string) => void;
    onCompleteOrder: (orderId: string) => void;
    onReadyToPickup: (orderId: string, amount: number) => void;
    isSubmitting?: boolean;
}