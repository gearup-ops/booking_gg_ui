import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCitiesAction } from '../actions/cityActions';
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
        builder
            .addCase(getCitiesAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCitiesAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cities = action.payload.data.cities;
            })
            .addCase(getCitiesAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedCityId, setLoading, setError } = citySlice.actions;
export default citySlice.reducer;
