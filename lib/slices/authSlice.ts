import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    sendOtpAction,
    registerUserAction,
    verifyOtpAction,
    getUserByIdAction,
    updateCustomerAction,
} from '../actions/userActions';
import { removeFromLocalStorage, setLocaleStorage } from '../utils';

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    gender: string;
    phone: string;
    address1: string;
    address2?: string;
    cityId?: number | null;
    pincode: string;
    longLat?: string;
    isActive?: boolean;
    isRegistered?: boolean;
    createdBy?: string;
    followUpDate?: string; // ISO date string
    createdAt?: string; // ISO timestamp
    updatedAt?: string; // ISO timestamp
    fcm?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loginStep: 'phone' | 'otp' | 'completed';
    phone: string;
    otp: string;
    confirmationResult: any | null;
    isLoading: boolean;
    error: string | null;
    token: string | null;
}

const initialState: AuthState = {
    // isAuthenticated: false,
    // user: null,
    isAuthenticated: false,
    user: null,
    loginStep: 'phone',
    phone: '',
    otp: '',
    confirmationResult: null,
    isLoading: false,
    error: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setphone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload;
            state.error = null;
        },
        setOtp: (state, action: PayloadAction<string>) => {
            state.otp = action.payload;
            state.error = null;
        },
        setLoginStep: (
            state,
            action: PayloadAction<'phone' | 'otp' | 'completed'>
        ) => {
            state.loginStep = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loginStep = 'phone';
            state.phone = '';
            state.otp = '';
            state.error = null;
            state.token = null;
            removeFromLocalStorage('token');
        },
        resetAuth: (state) => {
            state.loginStep = 'phone';
            state.phone = '';
            state.otp = '';
            state.error = null;
            state.isLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Send OTP
        builder
            .addCase(sendOtpAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendOtpAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.confirmationResult = action.payload.confirmationResult;
                state.phone = action.payload.phone;
                state.loginStep = 'otp';
            })
            .addCase(sendOtpAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Register User
        builder
            .addCase(registerUserAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUserAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
            })
            .addCase(registerUserAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Verify OTP
        builder
            .addCase(verifyOtpAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOtpAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                // state.toekn = action.payload.toekn;
                state.token = action.payload.token;
                state.loginStep = 'completed';
            })
            .addCase(verifyOtpAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get User By ID
        builder
            .addCase(getUserByIdAction.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserByIdAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data[0];
                state.isAuthenticated = true;
                setLocaleStorage('cityId', action.payload.data[0].cityId);
            })
            .addCase(getUserByIdAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Customer
        builder
            .addCase(updateCustomerAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCustomerAction.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.user = { ...state.user, ...action.payload.user };
            })
            .addCase(updateCustomerAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setAuthenticated,
    setphone,
    setOtp,
    setLoginStep,
    logout,
    resetAuth,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;
