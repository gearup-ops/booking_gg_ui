import { apiClient } from './client';
import { City } from './cityApi';

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

export interface ContactAddress {
    id: number;
    phone: string;
    whatsapp: string;
    location: string;
    address: string;
    city_id: number;
    is_active: boolean;
    email: string;
    label: string;
}

export interface Socials {
    id: number;
    email: string;
    phone: string;
    fb_page_url: string;
    insta_page_url: string;
    company_website_url: string;
    linked_in_page_url: string;
    twitter_page_url: string;
    you_tube_page_url: string;
}

export interface ContactDetailsData {
    contactAddresses: ContactAddress[];
    socials: Socials;
    cities: City[];
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
        const response = await apiClient.get('/v1/aboutUs/getAboutUsData');
        return response.data;
    },

    getContactDetails: async (
        city_id?: number
    ): Promise<{
        success: boolean;
        data: ContactDetailsData;
    }> => {
        const response = await apiClient.get('/contact/getContactDetails', {
            params: city_id ? { city_id } : {},
        });
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
