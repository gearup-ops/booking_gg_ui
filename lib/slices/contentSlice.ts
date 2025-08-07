import { createSlice } from '@reduxjs/toolkit';
import {
    getAboutUsDataAction,
    getContactDetailsAction,
    getHomePageDataAction,
} from '../actions/contentActions';
import { AboutUsData, ContactDetails, HomePageData } from '../api/contentApi';

interface ContentState {
    aboutUsData: AboutUsData | null;
    contactDetails: ContactDetails | null;
    homePageData: HomePageData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ContentState = {
    aboutUsData: null,
    contactDetails: null,
    homePageData: null,
    isLoading: false,
    error: null,
};

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get About Us Data
        builder
            .addCase(getAboutUsDataAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAboutUsDataAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.aboutUsData = action.payload.data;
            })
            .addCase(getAboutUsDataAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Contact Details
        builder
            .addCase(getContactDetailsAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getContactDetailsAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.contactDetails = action.payload.data;
            })
            .addCase(getContactDetailsAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Home Page Data
        builder
            .addCase(getHomePageDataAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getHomePageDataAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.homePageData = action.payload.data;
            })
            .addCase(getHomePageDataAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = contentSlice.actions;
export default contentSlice.reducer;
