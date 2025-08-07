import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi, AddOrderRequest } from '../api/orderApi';

export const addOrderAction = createAsyncThunk(
    'order/addOrder',
    async (data: AddOrderRequest, { rejectWithValue }) => {
        try {
            const response = await orderApi.addOrder(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create order'
            );
        }
    }
);

export const getOrdersByUserIdAction = createAsyncThunk(
    'order/getOrdersByUserId',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await orderApi.getOrdersByUserId(userId);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
        }
    }
);
