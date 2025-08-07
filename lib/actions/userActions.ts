import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    userApi,
    SendOtpRequest,
    RegisterRequest,
    VerifyOtpRequest,
    UpdateCustomerRequest,
} from '../api/userApi';

export const sendOtpAction = createAsyncThunk(
    'auth/sendOtp',
    async (data: SendOtpRequest, { rejectWithValue }) => {
        try {
            const response = await userApi.sendOtp(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send OTP'
            );
        }
    }
);

export const registerUserAction = createAsyncThunk(
    'auth/register',
    async (data: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await userApi.register(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

export const verifyOtpAction = createAsyncThunk(
    'auth/verifyOtp',
    async (data: VerifyOtpRequest, { rejectWithValue }) => {
        try {
            const response = await userApi.verifyOtp(data);
            if (response.success && response.token) {
                localStorage.setItem('authToken', response.token);
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'OTP verification failed'
            );
        }
    }
);

export const getUserByIdAction = createAsyncThunk(
    'auth/getUserById',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await userApi.getUserById(userId);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            );
        }
    }
);

export const updateCustomerAction = createAsyncThunk(
    'auth/updateCustomer',
    async (
        { userId, data }: { userId: string; data: UpdateCustomerRequest },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.updateCustomer(userId, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update customer'
            );
        }
    }
);
