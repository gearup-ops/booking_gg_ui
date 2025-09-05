import { User } from '../slices/authSlice';
import { apiClient } from './client';

export interface SendOtpRequest {
    phone: string;
    confirmationResult?: any;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
    otpId: string;
}

export interface RegisterRequest {
    phone: string;
    fcm?: string;
}

export interface RegisterResponse {
    code: boolean;
    message: string;
    token: string;
}

export interface VerifyOtpRequest {
    phone: string;
    otp: string;
    otpId: string;
}

export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
    };
}

export interface UpdateCustomerRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    email?: string;
    address1?: string;
    address2?: string;
    city?: number | string | null;
    state?: string;
    country?: string;
    pincode?: string;
    longLat?: string;
}

export const userApi = {
    sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
        const response = await apiClient.post('/api/user/sendOtp', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post('/user/v1/register', data);
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
        const response = await apiClient.post('/api/user/verifyOtp', data);
        return response.data;
    },

    getUserById: async () => {
        const response = await apiClient.get(`/user/v1/getUserById`);
        return response.data;
    },

    updateCustomer: async (data: UpdateCustomerRequest) => {
        const response = await apiClient.put(`/user/v1/updateCustomer`, data);
        return response.data;
    },
};
