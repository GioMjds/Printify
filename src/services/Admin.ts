import { API } from "./_axios";

type AdminAccountAction = {
  uploadId: string;
};

type UploadID = {
  uploadId: string;
};

export const fetchAllPrintOrders = async () => {
  try {
    const response = await API.get("/admin/fetch_print_orders", {
      params: { action: "fetch_print_orders" },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch print orders: ${error}`);
    throw error;
  }
};

export const fetchPrintOrder = async ({ uploadId }: UploadID) => {
  try {
    const response = await API.get(`/admin/upload/${uploadId}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
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

export const fetchUsers = async () => {
  try {
    const response = await API.get("/admin/fetch_users", {
      params: { action: "fetch_users" },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch users: ${error}`);
    throw error;
  }
};

// Update upload status with notification
export const updateUploadStatus = async (
  uploadId: string,
  newStatus: string,
  rejectionReason?: string
) => {
  try {
    const response = await API.put(
      "/admin/update_status",
      {
        adminAction: "update_upload_status",
        uploadId,
        newStatus,
        rejectionReason,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update upload status: ${error}`);
    throw error;
  }
};

// Reject print order with reason
export const rejectPrintOrder = async (
  uploadId: string,
  rejectionReason?: string
) => {
  try {
    const response = await API.put(
      "/admin/reject_order",
      {
        adminAction: "reject_print_order",
        uploadId,
        rejectionReason,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to reject print order: ${error}`);
    throw error;
  }
};

// Set order as ready for pickup
export const setOrderReadyForPickup = async (uploadId: string) => {
  return updateUploadStatus(uploadId, "ready_to_pickup");
};

// Complete an order
export const completeOrder = async (uploadId: string) => {
  return updateUploadStatus(uploadId, "completed");
};

// Cancel an order
export const cancelOrder = async (uploadId: string) => {
  return updateUploadStatus(uploadId, "cancelled");
};
