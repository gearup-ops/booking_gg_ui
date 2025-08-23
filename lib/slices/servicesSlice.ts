import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getServicesAction,
    getServiceByIdAction,
} from '../actions/serviceActions';

interface ServicePrice {
    id: number;
    price: number;
    type: 'gear' | 'nonGear' | string;
}

interface Service {
    _id: number;
    serviceName: string;
    serviceShortDescription: string;
    isActive: boolean;
    serviceImageUrl: string;
    serviceChecks: string;
    orderNo: number;
    createdAt: string;
    updatedAt: string;
    prices: ServicePrice[];
}

interface ServicesState {
    services: Service[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ServicesState = {
    services: [],
    isLoading: false,
    error: null,
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setServices: (state, action: PayloadAction<Service[]>) => {
            state.services = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    // extraReducers: (builder) => {
    //     // Get Services
    //     builder
    //         .addCase(getServicesAction.pending, (state) => {
    //             state.isLoading = true;
    //             state.error = null;
    //         })
    //         .addCase(getServicesAction.fulfilled, (state, action) => {
    //             state.isLoading = false;
    //             state.services = action.payload.services;
    //         })
    //         .addCase(getServicesAction.rejected, (state, action) => {
    //             state.isLoading = false;
    //             state.error = action.payload as string;
    //         });

    //     // Get Service By ID
    //     builder
    //         .addCase(getServiceByIdAction.pending, (state) => {
    //             state.isLoading = true;
    //             state.error = null;
    //         })
    //         .addCase(getServiceByIdAction.fulfilled, (state, action) => {
    //             state.isLoading = false;
    //             state.selectedService = action.payload.service;
    //         })
    //         .addCase(getServiceByIdAction.rejected, (state, action) => {
    //             state.isLoading = false;
    //             state.error = action.payload as string;
    //         });
    // },
});

export const { setLoading, setServices, setError } = servicesSlice.actions;
export default servicesSlice.reducer;
