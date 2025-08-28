import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    addOrderAction,
    getOrdersByUserIdAction,
} from '../actions/orderActions';
import { CycleDetails, Order } from '../api/orderApi';

interface CustomerDetails {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    gender: string;
    phoneNumber: string;
    address1: string;
    address2?: string;
    cityId?: number | string;
    pinCode: string;
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
    currentStep: 'customer-details',
    selectedService: null,
    cycles: [{ id: '1', brand: '', type: 'gear', image: '', serviceId: null }],
    customerDetails: {
        firstName: '',
        lastName: '',
        gender: 'male',
        phoneNumber: '',
        address1: '',
        address2: '',
        cityId: 3,
        // state: '',
        // country: '',
        pinCode: '',
    },
    isExistingUser: false,
    existingCycles: [],
    selectedExistingCycle: null,
    isLocationAvailable: true,
    orderId: null,
    termsAccepted: false,
    orders: [
        {
            id: 'order1',
            userId: 'user1',
            serviceId: 'service1',
            serviceName: 'Full Service',
            cycles: [
                {
                    // id: 'cycle1',
                    brand: 'Hero',
                    type: 'gear',
                    image: 'photo1.jpg',
                    serviceId: null,
                },
            ],
            customerDetails: {
                firstName: '',
                lastName: '',
                gender: 'male',
                phoneNumber: '',
                address1: '',
                address2: '',
                cityId: 0,
                // state: '',
                // country: '',
                pinCode: '',
            },
            status: 'pending',
            scheduledDate: '2024-06-01',
            timeSlot: '10:00-12:00',
            totalAmount: 500,
            createdAt: '2024-05-30T10:00:00Z',
            updatedAt: '2024-05-30T10:00:00Z',
            technicianId: 'tech1',
            technicianName: 'Alice',
            notes: 'Handle with care',
        },
        {
            id: 'order2',
            userId: 'user2',
            serviceId: 'service2',
            serviceName: 'Basic Service',
            cycles: [
                {
                    // id: 'cycle2',
                    brand: 'BSA',
                    type: 'non-gear',
                    image: 'photo2.jpg',
                    serviceId: null,
                },
            ],
            customerDetails: {
                firstName: 'Jane',
                lastName: 'Smith',
                gender: 'female',
                phoneNumber: '9876543210',
                address1: '456 Park Ave',
                address2: '',
                cityId: 2,
                // state: 'Maharashtra',
                // country: 'India',
                pinCode: '400001',
            },
            status: 'confirmed',
            scheduledDate: '2024-06-02',
            timeSlot: '14:00-16:00',
            totalAmount: 300,
            createdAt: '2024-05-31T11:00:00Z',
            updatedAt: '2024-05-31T11:00:00Z',
            technicianId: 'tech2',
            technicianName: 'Bob',
            notes: '',
        },
    ],
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
        addNewCycle: (state) => {
            const newId = (state.cycles.length + 1).toString();
            state.cycles.push({
                id: newId,
                brand: '',
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
    setLoading,
} = orderSlice.actions;

export default orderSlice.reducer;
