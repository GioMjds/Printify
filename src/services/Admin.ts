import { AddExpense, DashboardMonthPick, NewStaff, UpdateStaff, UploadStatusUpdate } from "@/types/Admin";
import { API } from "./_axios";

// /admin
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
};

// /admin/expenses
export const fetchExpenses = async () => {
    try {
        const response = await API.get("/admin/expenses", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch expenses: ${error}`);
        throw error;
    }
};

export const addExpense = async ({ expenseName, amount, category, description, occuredAt }: AddExpense) => {
    try {
        const response = await API.post("/admin/expenses", {
            expenseName: expenseName,
            amount: amount,
            category: category,
            description: description,
            occuredAt: occuredAt,
        }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to add expense: ${error}`);
        throw error;
    }
};

export const updateExpense = async ({ expenseId, expenseName, amount, category, description, occuredAt }: { expenseId: string | number } & AddExpense) => {
    try {
        const response = await API.put(`/admin/expenses/${expenseId}`, {
            expenseName: expenseName,
            amount: amount,
            category: category,
            description: description,
            occuredAt: occuredAt,
        }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update expense: ${error}`);
        throw error;
    }
}

export const deleteExpense = async ({ expenseId }: { expenseId: string | number }) => {
    try {
        const response = await API.delete(`/admin/expenses/${expenseId}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete expense: ${error}`);
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

export const updateUploadStatus = async ({ uploadId, newStatus, rejectionReason, amount }: UploadStatusUpdate) => {
    try {
        const response = await API.put("/admin/[adminAction]", {
            adminAction: "update_upload_status",
            uploadId,
            newStatus,
            rejectionReason,
            amount,
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
        const response = await API.get("/admin/[adminAction]/?action=fetch_staff", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch staff: ${error}`);
        throw error;
    }
};

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
};

export const updateStaff = async ({ staffId, firstName, middleName, lastName, email }: UpdateStaff) => {
    try {
        const response = await API.put("/admin/[adminAction]", {
            adminAction: "update_staff",
            staffId,
            firstName,
            middleName,
            lastName,
            email,
        }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update staff: ${error}`);
        throw error;
    }
};

export const deleteStaff = async ({ staffId }: { staffId: string }) => {
    try {
        const response = await API.delete(`/admin/[adminAction]/delete_staff`, {
            data: {
                adminAction: "delete_staff",
                staffId,
            },
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete staff: ${error}`);
        throw error;
    }
};
