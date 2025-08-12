import { apiClient } from './client';

export interface SendOtpRequest {
    phoneNumber: string;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
    otpId: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    gender: 'male' | 'female';
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email?: string;
    };
}

export interface VerifyOtpRequest {
    phoneNumber: string;
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
        phoneNumber: string;
        email?: string;
    };
}

export interface UpdateCustomerRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
}

export const userApi = {
    sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
        const response = await apiClient.post('/api/user/sendOtp', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post('/api/user/v1/register', data);
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
        const response = await apiClient.post('/api/user/verifyOtp', data);
        return response.data;
    },

    getUserById: async (userId: string) => {
        const response = await apiClient.get(
            `/api/user/v1/getUserById/${userId}`
        );
        return response.data;
    },

    updateCustomer: async (userId: string, data: UpdateCustomerRequest) => {
        const response = await apiClient.put(
            `/api/user/v1/updateCustomer/${userId}`,
            data
        );
        return response.data;
    },
};
