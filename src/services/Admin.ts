import { API } from "./_axios";

type UploadID = {
  uploadId: string;
};

type UploadStatusUpdate = {
  uploadId: string;
  newStatus: string;
  rejectionReason?: string;
}

type DashboardMonthPick = {
  month?: number;
  year?: number;
}

type NewStaff = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export const fetchAdminDashboardDetails = async ({ month, year }: DashboardMonthPick) => {
  try {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());
    const response = await API.get(`/admin?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch admin dashboard details: ${error}`);
    throw error;
  }
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

// Manage Staff
export const fetchStaff = async () => {
  try {
    const response = await API.get("/admin/[adminAction]?action=fetch_staff",  {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch staff: ${error}`);
    throw error;
  }
}

export const addNewStaff = async ({ firstName, middleName, lastName, email, password, confirmPassword, role }: NewStaff) => {
  try {
    const response = await API.post("/admin/add_staff", {
      adminAction: "add_staff",
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      role: role,
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to add new staff: ${error}`);
    throw error;
  }
}