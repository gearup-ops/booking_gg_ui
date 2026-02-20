import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    mobileMenuOpen: boolean;
    activeTestimonial: number;
    openFAQ: string | null;
    showCityPopup: boolean;
}

const initialState: UIState = {
    mobileMenuOpen: false,
    activeTestimonial: 0,
    openFAQ: null,
    showCityPopup: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        setActiveTestimonial: (state, action: PayloadAction<number>) => {
            state.activeTestimonial = action.payload;
        },
        toggleFAQ: (state, action: PayloadAction<string>) => {
            state.openFAQ =
                state.openFAQ === action.payload ? null : action.payload;
        },
        setCityPopup: (state, action: PayloadAction<boolean>) => {
            state.showCityPopup = action.payload;
        },
    },
});

export const {
    toggleMobileMenu,
    setActiveTestimonial,
    toggleFAQ,
    setCityPopup,
} = uiSlice.actions;
export default uiSlice.reducer;
