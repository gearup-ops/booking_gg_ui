import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi, AddOrderRequest } from '../api/orderApi';

export const addOrderAction = createAsyncThunk(
    'order/addOrder',
    async (data: AddOrderRequest, { rejectWithValue }) => {
        try {
            return {
                order: {
                    userId: 'cycleUser001',
                    serviceId: 'cycleService789',
                    cycles: [
                        {
                            brand: 'Hero',
                            type: 'Hybrid',
                            photo: 'https://dummyimage.com/600x400/000/fff&text=Hero+Hybrid',
                            serviceId: 'cycleService789',
                        },
                        {
                            brand: 'Firefox',
                            type: 'Mountain',
                            photo: 'https://dummyimage.com/600x400/000/fff&text=Firefox+Mountain',
                            serviceId: 'cycleService789',
                        },
                    ],
                    customerDetails: {
                        firstName: 'Alice',
                        lastName: 'Smith',
                        phoneNumber: '9876543210',
                        addressLine1: '456 Cycle Lane',
                        addressLine2: 'Suite 12',
                        city: 'Cyclestown',
                        state: 'CA',
                        country: 'USA',
                        pinCode: '90210',
                    },
                    totalAmount: 3500,
                },
            };
            // const response = await orderApi.addOrder(data);
            // return response;
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
