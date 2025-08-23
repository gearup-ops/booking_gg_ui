import { createAsyncThunk } from '@reduxjs/toolkit';
import { serviceApi } from '../api/serviceApi';
import { setLoading } from '../slices/servicesSlice';

export const getServicesAction = createAsyncThunk(
    'services/getServices',
    async (data: { city: number }, { rejectWithValue, dispatch }) => {
        try {
            dispatch(setLoading(true));

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // In a real app, this would be an actual API call:
            // const response = await fetch('/api/services')
            // const services = await response.json()

            // dispatch(setServices(mockServices));
            const response = await serviceApi.getServices(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch services'
            );
        }
    }
);

export const getServiceByIdAction = createAsyncThunk(
    'services/getServiceById',
    async (serviceId: number | string, { rejectWithValue }) => {
        try {
            const response = await serviceApi.getServiceById(serviceId);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch service'
            );
        }
    }
);
