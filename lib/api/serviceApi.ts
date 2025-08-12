import { apiClient } from './client';

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    gearPrice: number;
    nonGearPrice: number;
    features: string[];
    image: string;
    category: string;
    isActive: boolean;
}

export interface GetServicesResponse {
    success: boolean;
    services: Service[];
}

export interface GetServiceByIdResponse {
    success: boolean;
    service: Service;
}

export const serviceApi = {
    getServices: async (city?: string): Promise<GetServicesResponse> => {
        const params = city ? { city } : {};
        const response = await apiClient.get('/api/service/getServices', {
            params,
        });
        return response.data;
    },

    getServiceById: async (
        serviceId: string
    ): Promise<GetServiceByIdResponse> => {
        const response = await apiClient.get(
            `/api/service/getServiceById/${serviceId}`
        );
        return response.data;
    },
};
