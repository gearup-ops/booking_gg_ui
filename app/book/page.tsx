'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RootState, AppDispatch } from '@/lib/store';
import { addOrderAction } from '@/lib/actions/orderActions';
import {
    updateCycleDetails,
    addNewCycle,
    updateCustomerDetails,
    setSelectedExistingCycle,
    checkLocationAvailability,
    setTermsAccepted,
    resetOrder,
    setCurrentStep,
    setSelectedService,
} from '@/lib/slices/orderSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Upload, MapPin } from 'lucide-react';
import Image from 'next/image';

function Book() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );
    const {
        currentStep,
        selectedService,
        cycles,
        customerDetails,
        isExistingUser,
        existingCycles,
        selectedExistingCycle,
        isLocationAvailable,
        orderId,
        termsAccepted,
        isLoading,
        error,
    } = useSelector((state: RootState) => state.order);

    // Initialize service from URL params
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const serviceId = searchParams.get('service');
        const serviceType = searchParams.get('type') as 'gear' | 'non-gear';
        const serviceName = searchParams.get('name');
        const servicePrice = searchParams.get('price');

        if (serviceId && serviceName && servicePrice && !selectedService) {
            dispatch(
                setSelectedService({
                    id: serviceId,
                    name: serviceName,
                    type: serviceType || 'gear',
                    price: parseInt(servicePrice),
                })
            );
        }

        // Pre-fill customer details from user data
        if (user && !customerDetails.firstName) {
            dispatch(
                updateCustomerDetails({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phoneNumber: user.phoneNumber || '',
                    addressLine1: user.addressLine1 || '',
                    addressLine2: user.addressLine2 || '',
                    city: user.city || '',
                    state: user.state || '',
                    country: user.country || '',
                    pinCode: user.pinCode || '',
                })
            );
        }
    }, [
        isAuthenticated,
        searchParams,
        selectedService,
        user,
        customerDetails.firstName,
        router,
        dispatch,
    ]);

    const handleNext = () => {
        if (currentStep === 'cycle-details') {
            dispatch(setCurrentStep('customer-details'));
        } else if (currentStep === 'customer-details') {
            dispatch(checkLocationAvailability(customerDetails.pinCode));
            if (
                isLocationAvailable &&
                termsAccepted &&
                user &&
                selectedService
            ) {
                // Create order
                const orderData = {
                    userId: user.id,
                    serviceId: selectedService.id,
                    cycles: cycles.map((cycle) => ({
                        brand: cycle.brand,
                        type: cycle.type,
                        photo: cycle.photo,
                        serviceId: selectedService.id,
                    })),
                    customerDetails: {
                        firstName: customerDetails.firstName,
                        lastName: customerDetails.lastName,
                        phoneNumber: customerDetails.phoneNumber,
                        addressLine1: customerDetails.addressLine1,
                        addressLine2: customerDetails.addressLine2,
                        city: customerDetails.city,
                        state: customerDetails.state,
                        country: customerDetails.country,
                        pinCode: customerDetails.pinCode,
                    },
                    totalAmount: selectedService.price * cycles.length,
                };

                dispatch(addOrderAction(orderData));
            }
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 'customer-details') {
            dispatch(setCurrentStep('cycle-details'));
        } else if (currentStep === 'cycle-details') {
            router.push('/');
        }
    };

    const renderProgressSteps = () => {
        const steps = [
            {
                key: 'cycle-details',
                label: 'Booking Initiated',
                subLabel: 'Your cycle details',
            },
            {
                key: 'customer-details',
                label: 'Add Your Details',
                subLabel: 'Your Cycle(s) Details',
            },
            {
                key: 'confirmation',
                label: 'Booking confirmed',
                subLabel: 'Technician assigned',
            },
        ];

        return (
            <div className='flex items-center justify-between mb-12 max-w-2xl mx-auto'>
                {steps.map((step, index) => (
                    <div key={step.key} className='flex flex-col items-center'>
                        <div className='flex items-center'>
                            <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    currentStep === step.key
                                        ? 'bg-[#fbbf24] text-black'
                                        : steps.findIndex(
                                              (s) => s.key === currentStep
                                          ) > index
                                        ? 'bg-[#fbbf24] text-black'
                                        : 'bg-gray-600 text-white'
                                }`}
                            >
                                {steps.findIndex((s) => s.key === currentStep) >
                                index
                                    ? '✓'
                                    : index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-24 h-0.5 mx-4 ${
                                        steps.findIndex(
                                            (s) => s.key === currentStep
                                        ) > index
                                            ? 'bg-[#fbbf24]'
                                            : 'bg-gray-600'
                                    }`}
                                />
                            )}
                        </div>
                        <div className='text-center mt-2'>
                            <p
                                className={`text-sm font-medium ${
                                    currentStep === step.key
                                        ? 'text-[#fbbf24]'
                                        : 'text-gray-400'
                                }`}
                            >
                                {currentStep === step.key
                                    ? step.label
                                    : step.subLabel}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCycleDetailsStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='max-w-4xl mx-auto'
        >
            <div className=''>
                {isExistingUser && (
                    <div className='mb-6'>
                        <Label className='text-black mb-2 block'>
                            Add existing cycle
                        </Label>
                        <Select
                            value={selectedExistingCycle || ''}
                            onValueChange={(value) =>
                                dispatch(setSelectedExistingCycle(value))
                            }
                        >
                            <SelectTrigger className='w-full text-black'>
                                <SelectValue placeholder='Select' />
                            </SelectTrigger>
                            <SelectContent>
                                {existingCycles.map((cycle) => (
                                    <SelectItem key={cycle.id} value={cycle.id}>
                                        {cycle.brand} - {cycle.type} (
                                        {cycle.service})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-xl font-semibold text-black'>
                            Upload your cycle details
                        </h3>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => dispatch(addNewCycle())}
                            className='text-[#fbbf24] hover:text-[#f59e0b] hover:bg-[#2a2b2d]'
                        >
                            + Add more Cycle
                        </Button>
                    </div>

                    {cycles.map((cycle, index) => (
                        <div key={cycle.id} className='space-y-4    '>
                            {cycles.length > 1 && (
                                <h4 className='font-medium text-black'>
                                    Cycle {index + 1}
                                </h4>
                            )}

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label className='text-black'>
                                        Cycle Brand
                                    </Label>
                                    <Input
                                        value={cycle.brand}
                                        onChange={(e) =>
                                            dispatch(
                                                updateCycleDetails({
                                                    index,
                                                    field: 'brand',
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        placeholder='Enter brand name'
                                        className='border-[#4a4b4d] text-black placeholder:text-gray-600'
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-black'>
                                        Cycle Type
                                    </Label>
                                    <RadioGroup
                                        value={cycle.type}
                                        onValueChange={(value) =>
                                            dispatch(
                                                updateCycleDetails({
                                                    index,
                                                    field: 'type',
                                                    value,
                                                })
                                            )
                                        }
                                        className='flex space-x-6'
                                    >
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem
                                                value='gear'
                                                id={`gear-${index}`}
                                                className='border-[#fbbf24] text-[#fbbf24]'
                                            />
                                            <Label
                                                htmlFor={`gear-${index}`}
                                                className='text-black'
                                            >
                                                Gear
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem
                                                value='non-gear'
                                                id={`non-gear-${index}`}
                                                className='border-[#fbbf24] text-[#fbbf24]'
                                            />
                                            <Label
                                                htmlFor={`non-gear-${index}`}
                                                className='text-black'
                                            >
                                                Non - gear
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-black'>
                                    Upload Bicycle photo
                                </Label>
                                <div className='border-2 border-dashed border-[#4a4b4d] rounded-lg p-8 text-center hover:border-[#fbbf24] transition-colors cursor-pointer'>
                                    <Upload className='w-8 h-8 text-gray-600 mx-auto mb-2' />
                                    <p className='text-gray-600 text-sm'>
                                        Click to upload or drag and drop
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderCustomerDetailsStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='max-w-4xl mx-auto'
        >
            <div className='text-black'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>First Name*</Label>
                        <Input
                            value={customerDetails.firstName}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        firstName: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter first name'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>Last Name*</Label>
                        <Input
                            value={customerDetails.lastName}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        lastName: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter last name'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>Gender</Label>
                        <RadioGroup
                            value={customerDetails.gender}
                            onValueChange={(value: 'male' | 'female') =>
                                dispatch(
                                    updateCustomerDetails({ gender: value })
                                )
                            }
                            className='flex space-x-6'
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value='male'
                                    id='male'
                                    className='border-[#fbbf24] text-[#fbbf24]'
                                />
                                <Label htmlFor='male' className='text-black'>
                                    Male
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value='female'
                                    id='female'
                                    className='border-[#fbbf24] text-[#fbbf24]'
                                />
                                <Label htmlFor='female' className='text-black'>
                                    Female
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>Phone Number*</Label>
                        <Input
                            value={customerDetails.phoneNumber}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        phoneNumber: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter phone number'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>Address line 1*</Label>
                        <Input
                            value={customerDetails.addressLine1}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        addressLine1: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter address'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>Locate Yourself</Label>
                        <div className='flex items-center justify-center h-10 border border-[#4a4b4d] rounded-md bg-white'>
                            <MapPin className='w-5 h-5 text-[#fbbf24]' />
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <Label className='text-black'>Address line 2</Label>
                    <Input
                        value={customerDetails.addressLine2}
                        onChange={(e) =>
                            dispatch(
                                updateCustomerDetails({
                                    addressLine2: e.target.value,
                                })
                            )
                        }
                        placeholder='Enter additional address details'
                        className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>City*</Label>
                        <Input
                            value={customerDetails.city}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        city: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter city'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>State*</Label>
                        <Input
                            value={customerDetails.state}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        state: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter state'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>Country*</Label>
                        <Input
                            value={customerDetails.country}
                            onChange={(e) =>
                                dispatch(
                                    updateCustomerDetails({
                                        country: e.target.value,
                                    })
                                )
                            }
                            placeholder='Enter country'
                            className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>PIN Code*</Label>
                        <Input
                            value={customerDetails.pinCode}
                            onChange={(e) => {
                                dispatch(
                                    updateCustomerDetails({
                                        pinCode: e.target.value,
                                    })
                                );
                                if (e.target.value.length === 6) {
                                    dispatch(
                                        checkLocationAvailability(
                                            e.target.value
                                        )
                                    );
                                }
                            }}
                            placeholder='Enter PIN code'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                !isLocationAvailable && customerDetails.pinCode
                                    ? 'border-red-500'
                                    : ''
                            }`}
                        />
                    </div>
                </div>

                {!isLocationAvailable && customerDetails.pinCode && (
                    <div className='bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-6'>
                        <h4 className='text-red-400 font-semibold mb-2'>Oh!</h4>
                        <p className='text-red-300 text-sm mb-2'>
                            Currently we don't provide service at your locality.
                            Please submit your details so we can{' '}
                            <span className='font-semibold'>contact you</span>{' '}
                            or <span className='font-semibold'>notify you</span>{' '}
                            when we will available.
                        </p>
                    </div>
                )}

                <div className='flex items-start space-x-2 mt-6'>
                    <Checkbox
                        id='terms'
                        checked={termsAccepted}
                        onCheckedChange={(checked) =>
                            dispatch(setTermsAccepted(checked as boolean))
                        }
                        className='border-[#fbbf24] data-[state=checked]:bg-[#fbbf24] data-[state=checked]:text-black'
                    />
                    <Label
                        htmlFor='terms'
                        className='text-sm text-gray-600 leading-relaxed'
                    >
                        I accept the{' '}
                        <span className='text-[#fbbf24] underline cursor-pointer'>
                            terms & conditions
                        </span>{' '}
                        set by gearup cycles. I have read all the{' '}
                        <span className='text-[#fbbf24] underline cursor-pointer'>
                            privacy policy
                        </span>
                        .
                    </Label>
                </div>

                {error && (
                    <div className='mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg'>
                        <p className='text-red-300 text-sm'>{error}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderConfirmationStep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='text-center space-y-8 max-w-2xl mx-auto'
        >
            <div className='rounded-lg p-12'>
                <div className='flex items-center justify-center mr-8 mb-8'>
                    <Image
                        src='/images/confirmation.svg'
                        alt='GearGrow Cycle Logo'
                        width={64}
                        height={64}
                        className='w-40 h-40'
                    />
                </div>

                <h2 className='text-3xl font-bold text-black mb-4'>
                    Your booking has been confirmed
                </h2>

                <div className='flex items-center justify-center space-x-2 mb-6'>
                    <span className='text-gray-600'>
                        You can track your booking
                    </span>
                    <Button
                        onClick={() => router.push('/track-booking')}
                        className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-4 py-1 text-sm rounded-full'
                    >
                        Here
                    </Button>
                </div>

                {orderId && (
                    <div className='bg-[#2a2b2d] p-4 rounded-lg'>
                        <p className='text-sm text-gray-600'>
                            Order ID:{' '}
                            <span className='font-semibold text-[#fbbf24]'>
                                {orderId}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className='min-h-screen bg-[#3c3d3f] text-white'>
            <Header />

            <div className='bg-white text-black m-6'>
                {/* Header Section */}
                <div className='bg-black py-6'>
                    <div className='container mx-auto px-4'>
                        <div className='text-center'>
                            <h1 className='text-2xl font-semibold text-[#fbbf24]'>
                                {selectedService?.name} -{' '}
                                {selectedService?.type === 'gear'
                                    ? 'Gear'
                                    : 'Non Gear'}{' '}
                                Bicycle
                            </h1>
                            <p className='text-gray-300 mt-1'>
                                Confirm Your booking
                            </p>
                        </div>
                    </div>
                </div>

                <div className='container mx-auto py-12'>
                    {/* Progress Steps */}
                    <div className='px-8'>{renderProgressSteps()}</div>

                    {/* Step Content */}
                    <AnimatePresence mode='wait'>
                        {currentStep === 'cycle-details' &&
                            renderCycleDetailsStep()}
                        {currentStep === 'customer-details' &&
                            renderCustomerDetailsStep()}
                        {currentStep === 'confirmation' &&
                            renderConfirmationStep()}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {currentStep !== 'confirmation' && (
                        <div className='flex justify-between mt-12 max-w-4xl mx-auto'>
                            <Button
                                onClick={handlePrevStep}
                                variant='outline'
                                className='border-[#4a4b4d] text-white hover:bg-[#3c3d3f] px-8 py-3'
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={
                                    isLoading ||
                                    (currentStep === 'customer-details' &&
                                        (!termsAccepted ||
                                            (!isLocationAvailable &&
                                                customerDetails.pinCode.length >
                                                    0)))
                                }
                                className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isLoading
                                    ? 'Processing...'
                                    : currentStep === 'customer-details' &&
                                      !isLocationAvailable &&
                                      customerDetails.pinCode
                                    ? 'Submit'
                                    : 'Next'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Book />
        </Suspense>
    );
}
