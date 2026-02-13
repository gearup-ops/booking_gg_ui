import { createAsyncThunk } from '@reduxjs/toolkit';
import { cityApi } from '../api/cityApi';

export const getCitiesAction = createAsyncThunk(
    'city/getCities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cityApi.getCities();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch cities'
            );
        }
    }
);
