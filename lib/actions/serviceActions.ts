import { createAsyncThunk } from '@reduxjs/toolkit';
import { serviceApi } from '../api/serviceApi';

export const getServicesAction = createAsyncThunk(
    'services/getServices',
    async (city: string, { rejectWithValue }) => {
        try {
            const response = await serviceApi.getServices(city);
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
    async (serviceId: string, { rejectWithValue }) => {
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
