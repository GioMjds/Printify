import { API } from "./_axios";

type UploadID = {
  uploadId: string;
};

type UploadStatusUpdate = {
  uploadId: string;
  newStatus: string;
  rejectionReason?: string;
}

export const fetchAllPrintOrders = async () => {
  try {
    const response = await API.get("/admin/[adminAction]/?action=fetch_print_orders", {
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

export const fetchUsers = async () => {
  try {
    const response = await API.get("/admin/[adminAction]?action=fetch_users", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch users: ${error}`);
    throw error;
  }
};

export const updateUploadStatus = async ({ uploadId, newStatus, rejectionReason }: UploadStatusUpdate) => {
  try {
    const response = await API.put("/admin/[adminAction]", {
        adminAction: "update_upload_status",
        uploadId,
        newStatus,
        rejectionReason,
    }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update upload status: ${error}`);
    throw error;
  }
};