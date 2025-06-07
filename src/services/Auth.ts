import { API } from "./_axios";

type Login = {
    email: string;
    password: string;
}

type SendRegisterOTP = {
    email: string;
    password: string;
    confirmPassword: string;
}

type VerifyOTP = {
    email: string;
    otp: string;
}

export const login = async ({ email, password }: Login) => {
    try {
        const response = await API.post("/auth/login", {
            action: "login",
            email: email,
            password: password
        }, {
            headers: { 'Content-Type': 'application/json' }, 
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Login failed: ${error}`);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await API.post("/auth/logout", {
            action: "logout"
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Logout failed: ${error}`);
        throw error;
    }
};

export const sendRegisterOtp = async ({ email, password, confirmPassword }: SendRegisterOTP) => {
    try {
        const response = await API.post("/auth/register", {
            action: "send_register_otp",
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Send register OTP failed: ${error}`);
        throw error;
    }
};

export const resendRegisterOtp = async (email: string) => {
    try {
        const response = await API.post("/auth/resend_otp", {
            action: "resend_otp",
            email: email
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Resend register OTP failed: ${error}`);
        throw error;
    }
};

export const verifyRegisterOtp = async ({ email, otp }: VerifyOTP) => {
    try {
        const response = await API.post("/auth/verify_otp", {
            action: "verify_otp",
            email: email,
            otp: otp
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        console.error(`Verify register OTP failed: ${error}`);
        throw error;
    }
};