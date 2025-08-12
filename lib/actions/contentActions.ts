import { createAsyncThunk } from '@reduxjs/toolkit';
import { contentApi } from '../api/contentApi';

export const getAboutUsDataAction = createAsyncThunk(
    'content/getAboutUsData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await contentApi.getAboutUsData();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch about us data'
            );
        }
    }
);

export const getContactDetailsAction = createAsyncThunk(
    'content/getContactDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await contentApi.getContactDetails();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    'Failed to fetch contact details'
            );
        }
    }
);

export const getHomePageDataAction = createAsyncThunk(
    'content/getHomePageData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await contentApi.getHomePageData();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    'Failed to fetch home page data'
            );
        }
    }
);
