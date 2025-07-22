import { toast } from "react-toastify";

export const showStatusUpdateToast = (status: string, amount?: number) => {
  switch (status) {
    case "ready_to_pickup":
      toast.success(`Print order marked as ready for pickup with amount ₱${amount}`);
      break;
    case "completed":
      toast.success("Print order marked as completed");
      break;
    case "rejected":
      toast.success("Print order rejected successfully");
      break;
    case "cancelled":
      toast.success("Print order cancelled successfully");
      break;
    case "printing":
      toast.success("Print order is now being printed");
      break;
    case "pending":
      toast.success("Print order status updated to pending");
      break;
    default:
      toast.success("Print order status updated successfully");
      break;
  }
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};

export const showWarningToast = (message: string) => {
  toast.warn(message);
};