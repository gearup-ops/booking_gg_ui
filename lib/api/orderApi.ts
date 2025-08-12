import { apiClient } from './client';

export interface CycleDetails {
    brand: string;
    type: 'gear' | 'non-gear';
    photo?: string;
    serviceId: string;
}

export interface AddOrderRequest {
    userId: string;
    serviceId: string;
    cycles: CycleDetails[];
    customerDetails: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        country: string;
        pinCode: string;
    };
    scheduledDate?: string;
    timeSlot?: string;
    totalAmount: number;
    notes?: string;
}

export interface Order {
    id: string;
    userId: string;
    serviceId: string;
    serviceName: string;
    cycles: CycleDetails[];
    customerDetails: AddOrderRequest['customerDetails'];
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    scheduledDate?: string;
    timeSlot?: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    technicianId?: string;
    technicianName?: string;
    notes?: string;
}

export interface AddOrderResponse {
    success: boolean;
    message: string;
    order: Order;
}

export interface GetOrdersResponse {
    success: boolean;
    orders: Order[];
}

export const orderApi = {
    addOrder: async (data: AddOrderRequest): Promise<AddOrderResponse> => {
        const response = await apiClient.post('/api/v1/orders/addOrder', data);
        return response.data;
    },

    getOrdersByUserId: async (userId: string): Promise<GetOrdersResponse> => {
        const response = await apiClient.get(
            `/api/v1/orders/getOrdersByUserId/${userId}`
        );
        return response.data;
    },
};
