import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './slices/servicesSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import contentReducer from './slices/contentSlice';

export const store = configureStore({
    reducer: {
        services: servicesReducer,
        ui: uiReducer,
        auth: authReducer,
        order: orderReducer,
        content: contentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
