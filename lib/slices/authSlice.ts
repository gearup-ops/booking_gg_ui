import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    sendOtpAction,
    registerUserAction,
    verifyOtpAction,
    getUserByIdAction,
    updateCustomerAction,
} from '../actions/userActions';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loginStep: 'phone' | 'otp' | 'completed';
    phoneNumber: string;
    otp: string;
    otpId: string | null;
    isLoading: boolean;
    error: string | null;
    token: string | null;
}

const initialState: AuthState = {
    // isAuthenticated: false,
    // user: null,
    isAuthenticated: true,
    user: null,
    loginStep: 'phone',
    phoneNumber: '',
    otp: '',
    otpId: null,
    isLoading: false,
    error: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPhoneNumber: (state, action: PayloadAction<string>) => {
            state.phoneNumber = action.payload;
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
            state.phoneNumber = '';
            state.otp = '';
            state.otpId = null;
            state.error = null;
            state.token = null;
            localStorage.removeItem('authToken');
        },
        resetAuth: (state) => {
            state.loginStep = 'phone';
            state.phoneNumber = '';
            state.otp = '';
            state.otpId = null;
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
                state.otpId = action.payload.otpId;
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
                state.user = action.payload.user;
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
                state.user = action.payload.user;
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
                state.user = action.payload.user;
                state.isAuthenticated = true;
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
                state.user = { ...state.user, ...action.payload.user };
            })
            .addCase(updateCustomerAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setPhoneNumber,
    setOtp,
    setLoginStep,
    logout,
    resetAuth,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;
