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
                    photo: 'photo1.jpg',
                    serviceId: '4564646',
                },
            ],
            customerDetails: {
                firstName: 'John',
                lastName: 'Doe',
                // gender: 'male',
                phoneNumber: '1234567890',
                addressLine1: '123 Main St',
                addressLine2: 'Apt 4B',
                city: 'Delhi',
                state: 'Delhi',
                country: 'India',
                pinCode: '110001',
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
                    photo: 'photo2.jpg',
                    serviceId: '8940699',
                },
            ],
            customerDetails: {
                firstName: 'Jane',
                lastName: 'Smith',
                // gender: 'female',
                phoneNumber: '9876543210',
                addressLine1: '456 Park Ave',
                addressLine2: '',
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
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
