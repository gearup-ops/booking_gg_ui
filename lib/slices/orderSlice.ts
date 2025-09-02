import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    addOrderAction,
    cancelOrderAction,
    getOrdersByUserIdAction,
} from '../actions/orderActions';
import { CycleDetails, Order } from '../api/orderApi';

interface CustomerDetails {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    gender: string;
    phone: string;
    address1: string;
    address2?: string;
    city?: number | string | null;
    pincode: string;
    longLat?: string;
    isActive?: boolean;
    isRegistered?: boolean;
    createdBy?: string;
    followUpDate?: string; // ISO date string
    createdAt?: string; // ISO timestamp
    updatedAt?: string; // ISO timestamp
    fcm?: string;
}

interface OrderState {
    currentStep: 'customer-details' | 'cycle-details' | 'confirmation';
    selectedService: {
        id: number;
        name: string;
        type: 'gear' | 'nonGear';
        price: number;
    } | null;
    cycles: CycleDetails[];
    customerDetails: CustomerDetails;
    isExistingUser: boolean;
    existingCycles: CycleDetails[];
    selectedExistingCycle: string | null;
    isLocationAvailable: boolean;
    orderId: string | null;
    termsAccepted: boolean;
    orders: Order[];
    isLoading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    currentStep: 'customer-details',
    selectedService: null,
    cycles: [{ id: '1', name: '', type: 'gear', image: '', serviceId: null }],
    customerDetails: {
        firstName: '',
        lastName: '',
        gender: 'male',
        phone: '',
        address1: '',
        address2: '',
        city: null,
        // state: '',
        // country: '',
        pincode: '',
    },
    isExistingUser: false,
    existingCycles: [],
    selectedExistingCycle: null,
    isLocationAvailable: true,
    orderId: null,
    termsAccepted: false,
    orders: [],
    isLoading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
            state.error = null;
        },
        setCurrentStep: (
            state,
            action: PayloadAction<OrderState['currentStep']>
        ) => {
            state.currentStep = action.payload;
        },
        setSelectedService: (
            state,
            action: PayloadAction<OrderState['selectedService']>
        ) => {
            state.selectedService = action.payload;
        },
        updateCycleDetails: (
            state,
            action: PayloadAction<{ index: number; field: string; value: any }>
        ) => {
            const { index, field, value } = action.payload;
            if (state.cycles[index]) {
                state.cycles[index] = {
                    ...state.cycles[index],
                    [field]: value,
                };
            }
        },
        setCycles: (state, action: PayloadAction<OrderState['cycles']>) => {
            state.cycles = action.payload;
        },
        addNewCycle: (state) => {
            const newId = (state.cycles.length + 1).toString();
            state.cycles.push({
                id: newId,
                name: '',
                type: 'gear',
                image: '',
                serviceId: null,
            });
        },
        updateCustomerDetails: (
            state,
            action: PayloadAction<Partial<CustomerDetails>>
        ) => {
            state.customerDetails = {
                ...state.customerDetails,
                ...action.payload,
            };
        },
        setSelectedExistingCycle: (state, action: PayloadAction<string>) => {
            state.selectedExistingCycle = action.payload;
        },
        checkLocationAvailability: (state, action: PayloadAction<string>) => {
            const unavailablepincodes = ['110001', '400001', '600001'];
            state.isLocationAvailable = !unavailablepincodes.includes(
                action.payload
            );
        },
        setTermsAccepted: (state, action: PayloadAction<boolean>) => {
            state.termsAccepted = action.payload;
        },
        resetOrder: (state) => {
            return { ...initialState, orders: state.orders };
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Add Order
        builder
            .addCase(addOrderAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addOrderAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderId = action.payload.order.id;
                state.currentStep = 'confirmation';
                // state.orders.unshift(action.payload.order);
            })
            .addCase(addOrderAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Orders By User ID
        builder
            .addCase(getOrdersByUserIdAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrdersByUserIdAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data.docs;
            })
            .addCase(getOrdersByUserIdAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(cancelOrderAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelOrderAction.fulfilled, (state, action) => {
                state.isLoading = false;
                alert('Order cancelled successfully');
            })
            .addCase(cancelOrderAction.rejected, (state, action) => {
                state.error = action.payload as string;
                alert(action.payload || 'Error in cancelling order');
                state.isLoading = false;
            });
    },
});

export const {
    setCurrentStep,
    setSelectedService,
    updateCycleDetails,
    addNewCycle,
    updateCustomerDetails,
    setSelectedExistingCycle,
    checkLocationAvailability,
    setTermsAccepted,
    resetOrder,
    clearError,
    setLoading,
    setCycles,
} = orderSlice.actions;

export default orderSlice.reducer;
