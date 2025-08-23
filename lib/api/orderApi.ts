import { apiClient } from './client';

export interface CycleDetails {
    id?: number | string;
    brand: string;
    type: 'gear' | 'non-gear';
    image?: string | File | null;
    order?: boolean;
    serviceId: number | null;
}

export interface AddOrderRequest {
    userId: string;
    serviceId: string;
    cycles: CycleDetails[];
    customerDetails: {
        firstName: string;
        lastName: string;
        gender: 'male' | 'female';
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

export interface AddOrder {
    address1: string;
    address2: string;
    city: number;
    pincode: string;
    cycles: CycleDetails[];
}

export interface Order {
    id: string;
    userId: string;
    serviceId: number | string | null;
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
        const response = await apiClient.post('/v1/orders/addOrder', data);
        return response.data;
    },

    getOrdersByUserId: async (userId: string): Promise<GetOrdersResponse> => {
        const response = await apiClient.get(
            `/api/v1/orders/getOrdersByUserId/${userId}`
        );
        return response.data;
    },
};
