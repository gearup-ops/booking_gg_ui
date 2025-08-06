import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  phone: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loginStep: 'phone' | 'otp' | 'completed'
  phoneNumber: string
  otp: string
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loginStep: 'phone',
  phoneNumber: '',
  otp: '',
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload
      state.error = null
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload
      state.error = null
    },
    setLoginStep: (state, action: PayloadAction<'phone' | 'otp' | 'completed'>) => {
      state.loginStep = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.loginStep = 'completed'
      state.isLoading = false
      state.error = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.loginStep = 'phone'
      state.phoneNumber = ''
      state.otp = ''
      state.error = null
    },
    resetAuth: (state) => {
      state.loginStep = 'phone'
      state.phoneNumber = ''
      state.otp = ''
      state.error = null
      state.isLoading = false
    },
  },
})

export const {
  setPhoneNumber,
  setOtp,
  setLoginStep,
  setLoading,
  setError,
  loginSuccess,
  logout,
  resetAuth,
} = authSlice.actions

export default authSlice.reducer
