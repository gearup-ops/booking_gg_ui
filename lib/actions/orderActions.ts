import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi, AddOrderRequest } from '../api/orderApi';

export const addOrderAction = createAsyncThunk(
    'order/addOrder',
    async (data: AddOrderRequest, { rejectWithValue }) => {
        try {
            return {
                order: {
                    id: 'order3',
                    userId: 'user2',
                    serviceId: 'service2',
                    serviceName: 'Basic Service',
                    cycles: [
                        {
                            // id: 'cycle2',
                            brand: 'BSA',
                            type: 'non-gear',
                            photo: 'photo2.jpg',
                            serviceId: '8940699',
                        },
                    ],
                    customerDetails: {
                        firstName: 'Jane',
                        lastName: 'Smith',
                        // gender: 'female',
                        phoneNumber: '9876543210',
                        addressLine1: '456 Park Ave',
                        addressLine2: '',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        country: 'India',
                        pinCode: '400001',
                    },
                    status: 'confirmed',
                    scheduledDate: '2024-06-02',
                    timeSlot: '14:00-16:00',
                    totalAmount: 300,
                    createdAt: '2024-05-31T11:00:00Z',
                    updatedAt: '2024-05-31T11:00:00Z',
                    technicianId: 'tech2',
                    technicianName: 'Bob',
                    notes: '',
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
