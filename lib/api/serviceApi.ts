import { apiClient } from './client';

interface ServicePrice {
    id: number;
    price: number;
    type: 'gear' | 'nonGear' | string; // restrict if only these two are valid
}

interface Service {
    _id: number;
    serviceName: string;
    serviceShortDescription: string;
    isActive: boolean;
    serviceImageUrl: string;
    serviceChecks: string; // it's stored as a stringified array in your data
    orderNo: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    prices: ServicePrice[];
}

export interface GetServicesResponse {
    // success: boolean;
    data: Service[];
}

export interface GetServiceByIdResponse {
    success: boolean;
    service: Service;
}

export const serviceApi = {
    getServices: async (data: {
        city?: number;
    }): Promise<GetServicesResponse> => {
        const params = data ? data : {};
        const response = await apiClient.get('/service/getServices', {
            params,
        });
        return response.data;
    },

    getServiceById: async (
        serviceId: number | string
    ): Promise<GetServiceByIdResponse> => {
        const response = await apiClient.get(
            `/api/service/getServiceById/${serviceId}`
        );
        return response.data;
    },
};
