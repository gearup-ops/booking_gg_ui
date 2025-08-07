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
    heroSection: {
        title: string;
        subtitle: string;
        ctaText: string;
        backgroundImage: string;
    };
    featuresSection: {
        title: string;
        features: {
            icon: string;
            title: string;
            description: string;
        }[];
    };
    testimonialsSection: {
        title: string;
        testimonials: {
            name: string;
            text: string;
            image: string;
            rating: number;
        }[];
    };
    brandsSection: {
        title: string;
        brands: string[];
    };
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
        const response = await apiClient.get(
            '/api/v1/landingPage/getHomePageData'
        );
        return response.data;
    },
};
