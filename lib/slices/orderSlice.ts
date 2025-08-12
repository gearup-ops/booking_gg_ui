import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    addOrderAction,
    getOrdersByUserIdAction,
} from '../actions/orderActions';
import { Order } from '../api/orderApi';

interface CycleDetails {
    id: string;
    brand: string;
    type: 'gear' | 'non-gear';
    photo?: string;
    service?: string;
}

interface CustomerDetails {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

interface OrderState {
    currentStep: 'cycle-details' | 'customer-details' | 'confirmation';
    selectedService: {
        id: string;
        name: string;
        type: 'gear' | 'non-gear';
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
    currentStep: 'cycle-details',
    selectedService: null,
    cycles: [{ id: '1', brand: '', type: 'gear', photo: '', service: '' }],
    customerDetails: {
        firstName: '',
        lastName: '',
        gender: 'male',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
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
        addNewCycle: (state) => {
            const newId = (state.cycles.length + 1).toString();
            state.cycles.push({
                id: newId,
                brand: '',
                type: 'gear',
                photo: '',
                service: '',
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
            const unavailablePinCodes = ['110001', '400001', '600001'];
            state.isLocationAvailable = !unavailablePinCodes.includes(
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
                state.orders.unshift(action.payload.order);
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
                state.orders = action.payload.orders;
            })
            .addCase(getOrdersByUserIdAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
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
} = orderSlice.actions;

export default orderSlice.reducer;
