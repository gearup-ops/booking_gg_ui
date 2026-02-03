import { apiClient } from './client';

export interface AboutUsData {
    title: string;
    description: string;
    mission: string;
    vision: string;
    values: string[];
    teamMembers: {
        name: string;
        position: string;
        image: string;
        bio: string;
    }[];
    stats: {
        bicyclesServiced: number;
        technicians: number;
        happyCustomers: number;
        yearsOfExperience: number;
    };
}

export interface ContactDetails {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    socialMedia: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
}

export interface HomePageData {
    id: number;
    s1: {
        hl: string;
        tl: string;
        img: string;
    };
    s2: {
        hl: string;
        tl: string;
        _id?: string;
    }[];
    s3: {
        hl: string;
        tl1: string;
        pts: {
            pt: string;
            _id?: string;
        }[];
        tl2: string;
        url: string;
    };
    s4: {
        hl: string;
        tl: string;
    }[];
    s5: {
        dsc: string;
    }[];
    s6: {
        hl: string;
        data: {
            no: string;
            tl: string;
        }[];
    };
    s7: {
        a: string;
        q: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export const contentApi = {
    getAboutUsData: async (): Promise<{
        success: boolean;
        data: AboutUsData;
    }> => {
        const response = await apiClient.get('/api/v1/aboutUs/getAboutUsData');
        return response.data;
    },

    getContactDetails: async (): Promise<{
        success: boolean;
        data: ContactDetails;
    }> => {
        const response = await apiClient.get('/api/contact/getContactDetails');
        return response.data;
    },

    getHomePageData: async (): Promise<{
        success: boolean;
        data: HomePageData;
    }> => {
        const response = await apiClient.get('/v1/landingPage/getHomePageData');
        return response.data;
    },
};
