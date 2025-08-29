import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi, AddOrderRequest, AddOrder } from '../api/orderApi';

export const addOrderAction = createAsyncThunk(
    'order/addOrder',
    async (data: AddOrder | any, { rejectWithValue }) => {
        try {
            const response = await orderApi.addOrder(data);
            // return response;
            return { order:{
                id: '12345',
                status: 'success',
                message: 'Order created successfully',
            }
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create order'
            );
        }
    }
);

export const getOrdersByUserIdAction = createAsyncThunk(
    'order/getOrdersByUserId',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderApi.getOrdersByUserId();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
        }
    }
);
