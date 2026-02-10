import { apiClient } from './client';

export interface City {
    id: number;
    name: string;
    state: string;
    country: string;
}

export interface GetCitiesResponse {
    // success: boolean; // based on user input, it seems successful response has code: 200, type: 'success'
    data: {
        cities: City[];
    };
}

export const cityApi = {
    getCities: async (): Promise<GetCitiesResponse> => {
        const response = await apiClient.get('/master/getCities');
        // const response = await apiClient.get('/api/master/getMasterData?city=3');
        return response.data;
    },
};
