import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getContactDetailsAction } from '../actions/contentActions';
import { City } from '../api/cityApi';

interface CityState {
    cities: City[];
    selectedCityId: number | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CityState = {
    cities: [],
    selectedCityId: null,
    isLoading: false,
    error: null,
};

const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {
        setSelectedCityId: (state, action: PayloadAction<number | null>) => {
            state.selectedCityId = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getContactDetailsAction.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.data.cities) {
                state.cities = action.payload.data.cities;
            }
        });
    },
});

export const { setSelectedCityId, setLoading, setError } = citySlice.actions;
export default citySlice.reducer;
