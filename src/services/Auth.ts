import { API } from "./_axios";

type Login = {
    email: string;
    password: string;
}

type SendRegisterOTP = {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type VerifyOTP = {
    email: string;
    otp: string;
}

type ForgotOtp = { email: string };
type ForgotVerify = { email: string; otp: string };
type ForgotReset = { email: string; otp: string; newPassword: string };

export const login = async ({ email, password }: Login) => {
    try {
        const response = await API.post("/auth/action/login", {
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
        const response = await API.post("/auth/action/logout", {
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

export const sendRegisterOtp = async ({ firstName, lastName, email, password, confirmPassword }: SendRegisterOTP) => {
    try {
        const response = await API.post("/auth/action/register", {
            action: "send_register_otp",
            firstName: firstName,
            lastName: lastName,
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
        const response = await API.post("/auth/action/resend_otp", {
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
        const response = await API.post("/auth/action/verify_otp", {
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

export const sendForgotOtp = async ({ email }: ForgotOtp) => {
    try {
        const response = await API.post("/auth/action/forgot_password_send_otp", {
            action: "forgot_password_send_otp",
            email: email
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Send forgot OTP failed: ${error}`);
        throw error;
    }
};

export const verifyForgotOtp = async ({ email, otp }: ForgotVerify) => {
    try {
        const response = await API.post("/auth/action/forgot_password", {
            action: "forgot_password_verify_otp",
            email: email,
            otp: otp
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Verify forgot OTP failed: ${error}`);
        throw error;
    }
};

export const resetForgotPassword = async ({ email, otp, newPassword }: ForgotReset) => {
    try {
        const response = await API.post("/auth/action/forgot_password/", {
            action: "forgot_password_reset_password",
            email: email,
            otp: otp,
            newPassword: newPassword
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Reset forgot password failed: ${error}`);
        throw error;
    }
};

// Session helper function
export const getSession = async () => {
    try {
        const response = await API.get('/session', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Get session failed: ${error}`);
        throw error;
    }
};