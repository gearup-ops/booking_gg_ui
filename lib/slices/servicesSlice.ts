import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getServicesAction, getServiceByIdAction } from '../actions/serviceActions'
import { Service } from '../api/serviceApi'

interface ServicesState {
  services: Service[]
  selectedService: Service | null
  isLoading: boolean
  error: string | null
  city: string | null
}

const initialState: ServicesState = {
  services: [],
  selectedService: null,
  isLoading: false,
  error: null,
  city: null,
}

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload
    },
    clearSelectedService: (state) => {
      state.selectedService = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Get Services
    builder
      .addCase(getServicesAction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getServicesAction.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = action.payload.services
      })
      .addCase(getServicesAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Get Service By ID
    builder
      .addCase(getServiceByIdAction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getServiceByIdAction.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedService = action.payload.service
      })
      .addCase(getServiceByIdAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCity, clearSelectedService, clearError } = servicesSlice.actions
export default servicesSlice.reducer
