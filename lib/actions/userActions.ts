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
            return {
                confirmationResult: data.confirmationResult,
                phone: data.phone,
            };
            // const response = await userApi.sendOtp(data);
            // return response;
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
            console.log('Registration response:', response);

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
            return {
                token: 'dummy-token',
                user: {
                    id: 'dummy-user-id',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: data.phone,
                    email: 'jondoe@gmail.com',
                    address1: '123 Main St',
                    address2: 'Apt 4B',
                    city: 'Springfield',
                    state: 'Maharashtra',
                    country: 'India',
                    pincode: '411057',
                },
            };
            // const response = await userApi.verifyOtp(data);
            // if (response.success && response.token) {
            //     localStorage.setItem('authToken', response.token);
            // }
            // return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'OTP verification failed'
            );
        }
    }
);

export const getUserByIdAction = createAsyncThunk(
    'auth/getUserById',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getUserById();
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
    async (data: UpdateCustomerRequest, { rejectWithValue }) => {
        try {
            const response = await userApi.updateCustomer(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update customer'
            );
        }
    }
);
