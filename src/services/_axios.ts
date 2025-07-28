import axios from "axios";

function getBaseUrl() {
    if (typeof window !== "undefined") {
        // Running in browser: use window.location to determine host
        const { hostname } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        // Use network URL for LAN/mobile access
        return process.env.NEXT_PUBLIC_API_NETWORK_URL;
    }
    // On server, default to localhost (or override as needed)
    return process.env.NEXT_PUBLIC_API_URL;
}

export const API = axios.create({
    baseURL: `${getBaseUrl()}/api`,
    withCredentials: true,
});