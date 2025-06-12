import { API } from "./_axios";

export const fetchAllPrintOrders = async () => {
    try {
        const response = await API.get('/admin/fetch_print_orders', {
            params: { action: 'fetch_print_orders' },
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch print orders: ${error}`);
        throw error;
    }
};