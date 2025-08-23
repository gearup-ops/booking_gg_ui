import { createAsyncThunk } from '@reduxjs/toolkit';
import { serviceApi } from '../api/serviceApi';
import { setLoading, setServices } from '../slices/servicesSlice';

const mockServices: Service[] = [
    {
        _id: 1,
        serviceName: 'Basic Service',
        serviceShortDescription: 'Essential maintenance for your bicycle',
        isActive: true,
        serviceImageUrl: '/placeholder-7pbvs.png',
        serviceChecks: JSON.stringify([
            'Chain lubrication',
            'Brake adjustment',
            'Tire pressure check',
            'Basic cleaning',
        ]),
        orderNo: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        prices: [
            { id: 1, price: 299, type: 'gear' },
            { id: 2, price: 199, type: 'nonGear' },
        ],
    },
    {
        _id: 2,
        serviceName: 'Premium Service',
        serviceShortDescription: 'Complete maintenance and tune-up',
        isActive: true,
        serviceImageUrl: '/bicycle-premium-service.png',
        serviceChecks: JSON.stringify([
            'Complete chain cleaning and lubrication',
            'Brake and gear adjustment',
            'Wheel truing',
            'Deep cleaning',
            'Safety inspection',
            'Cable replacement if needed',
        ]),
        orderNo: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        prices: [
            { id: 3, price: 599, type: 'gear' },
            { id: 4, price: 399, type: 'nonGear' },
        ],
    },
    {
        _id: 3,
        serviceName: 'Express Service',
        serviceShortDescription: 'Quick maintenance for busy schedules',
        isActive: true,
        serviceImageUrl: '/bicycle-express.png',
        serviceChecks: JSON.stringify([
            'Quick chain lubrication',
            'Brake check',
            'Tire inflation',
            'Quick wipe down',
        ]),
        orderNo: 3,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        prices: [
            { id: 5, price: 149, type: 'gear' },
            { id: 6, price: 99, type: 'nonGear' },
        ],
    },
];

export const getServicesAction = createAsyncThunk(
    'services/getServices',
    async (city: string, { rejectWithValue, dispatch }) => {
        try {
            dispatch(setLoading(true));

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // In a real app, this would be an actual API call:
            // const response = await fetch('/api/services')
            // const services = await response.json()

            dispatch(setServices(mockServices));
            // const response = await serviceApi.getServices(city);
            // return response;
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
