'use client';

import { useState, useEffect } from 'react';
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
import { RootState } from '@/lib/store';
import {
    updateCycleDetails,
    addNewCycle,
    updateCustomerDetails,
    setSelectedExistingCycle,
    checkLocationAvailability,
    setTermsAccepted,
    confirmBooking,
    resetOrder,
    setCurrentStep,
} from '@/lib/slices/orderSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    MapPin,
    Phone,
    User,
    CalendarIcon,
    Upload,
    X,
} from 'lucide-react';

const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
];

export default function BookPage() {
    const dispatch = useDispatch();
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
    } = useSelector((state: RootState) => state.order);

    // Initialize service from URL params
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const serviceId = searchParams.get('service');
        const serviceType = searchParams.get('type');
        const serviceName = searchParams.get('name');
        const servicePrice = searchParams.get('price');

        if (serviceId && !selectedService) {
            // Set service data from URL params
            // This would normally come from Redux state or API
            dispatch(setCurrentStep('cycle-details'));
        }
    }, [isAuthenticated, searchParams, selectedService, router, dispatch]);

    const handleNext = () => {
        if (currentStep === 'cycle-details') {
            dispatch(setCurrentStep('customer-details'));
        } else if (currentStep === 'customer-details') {
            dispatch(checkLocationAvailability(customerDetails.pinCode));
            if (isLocationAvailable && termsAccepted) {
                dispatch(confirmBooking());
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
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
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
            <div className='bg-[#3c3d3f] rounded-lg p-8 border border-[#4a4b4d]'>
                {isExistingUser && (
                    <div className='mb-6'>
                        <Label className='text-white mb-2 block'>
                            Add existing cycle
                        </Label>
                        <Select
                            value={selectedExistingCycle || ''}
                            onValueChange={(value) =>
                                dispatch(setSelectedExistingCycle(value))
                            }
                        >
                            <SelectTrigger className='w-full bg-[#2a2b2d] border-[#4a4b4d] text-white'>
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
                        <h3 className='text-xl font-semibold text-white'>
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
                        <div
                            key={cycle.id}
                            className='space-y-4 p-6 border border-[#4a4b4d] rounded-lg bg-[#2a2b2d]'
                        >
                            {cycles.length > 1 && (
                                <h4 className='font-medium text-white'>
                                    Cycle {index + 1}
                                </h4>
                            )}

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label className='text-white'>
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
                                        className='bg-[#060608] border-[#4a4b4d] text-white placeholder:text-gray-500'
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-white'>
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
                                                className='text-white'
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
                                                className='text-white'
                                            >
                                                Non - gear
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            {cycles.length > 1 && (
                                <div className='space-y-2'>
                                    <Label className='text-white'>
                                        Select Service
                                    </Label>
                                    <Select
                                        value={cycle.service}
                                        onValueChange={(value) =>
                                            dispatch(
                                                updateCycleDetails({
                                                    index,
                                                    field: 'service',
                                                    value,
                                                })
                                            )
                                        }
                                    >
                                        <SelectTrigger className='w-full bg-[#060608] border-[#4a4b4d] text-white'>
                                            <SelectValue placeholder='Select service' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='standard'>
                                                Standard Service
                                            </SelectItem>
                                            <SelectItem value='premium'>
                                                Premium Service
                                            </SelectItem>
                                            <SelectItem value='annual'>
                                                Annual Maintenance
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className='space-y-2'>
                                <Label className='text-white'>
                                    Upload Bicycle photo
                                </Label>
                                <div className='border-2 border-dashed border-[#4a4b4d] rounded-lg p-8 text-center hover:border-[#fbbf24] transition-colors cursor-pointer bg-[#060608]'>
                                    <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                    <p className='text-gray-400 text-sm'>
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
            <div className='bg-[#3c3d3f] rounded-lg p-8 border border-[#4a4b4d]'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <Label className='text-white'>First Name*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-white'>Last Name*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-white'>Gender</Label>
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
                                <Label htmlFor='male' className='text-white'>
                                    Male
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value='female'
                                    id='female'
                                    className='border-[#fbbf24] text-[#fbbf24]'
                                />
                                <Label htmlFor='female' className='text-white'>
                                    Female
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-white'>Phone Number*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-white'>Address line 1*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-white'>Locate Yourself</Label>
                        <div className='flex items-center justify-center h-10 border border-[#4a4b4d] rounded-md bg-[#2a2b2d]'>
                            <MapPin className='w-5 h-5 text-[#fbbf24]' />
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <Label className='text-white'>Address line 2</Label>
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
                        className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500 mt-2'
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-white'>City*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-white'>State*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-white'>Country*</Label>
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
                            className='bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-white'>PIN Code*</Label>
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
                            className={`bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500 ${
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
                        className='text-sm text-gray-300 leading-relaxed'
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
            <div className='bg-[#3c3d3f] rounded-lg p-12 border border-[#4a4b4d]'>
                <div className='relative mb-8'>
                    <div className='w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto'>
                        <div className='w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center relative'>
                            <svg
                                width='32'
                                height='24'
                                viewBox='0 0 32 24'
                                className='text-black'
                            >
                                <path
                                    d='M8 12L4 16L12 8L16 12L28 0'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    fill='none'
                                />
                            </svg>
                        </div>
                        <div className='absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                            <CheckCircle2 className='w-5 h-5 text-white' />
                        </div>
                    </div>
                </div>

                <h2 className='text-3xl font-bold text-white mb-4'>
                    Your booking has been confirmed
                </h2>

                <div className='flex items-center justify-center space-x-2 mb-6'>
                    <span className='text-gray-300'>
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
                        <p className='text-sm text-gray-300'>
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
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />

            {/* Header Section */}
            <div className='bg-black py-6'>
                <div className='container mx-auto px-4'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold text-[#fbbf24]'>
                            Premium service - Non Gear Bicycle
                        </h1>
                        <p className='text-gray-300 mt-1'>
                            Confirm Your booking
                        </p>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-12'>
                {/* Progress Steps */}
                {currentStep !== 'confirmation' && renderProgressSteps()}

                {/* Step Content */}
                <AnimatePresence mode='wait'>
                    {currentStep === 'cycle-details' &&
                        renderCycleDetailsStep()}
                    {currentStep === 'customer-details' &&
                        renderCustomerDetailsStep()}
                    {currentStep === 'confirmation' && renderConfirmationStep()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep !== 'confirmation' && (
                    <div className='flex justify-between mt-12 max-w-4xl mx-auto'>
                        <Button
                            onClick={handlePrevStep}
                            variant='outline'
                            className='border-[#4a4b4d] text-white hover:bg-[#3c3d3f] px-8 py-3'
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={
                                currentStep === 'customer-details' &&
                                (!termsAccepted ||
                                    (!isLocationAvailable &&
                                        customerDetails.pinCode.length > 0))
                            }
                            className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {currentStep === 'customer-details' &&
                            !isLocationAvailable &&
                            customerDetails.pinCode
                                ? 'Submit'
                                : 'Next'}
                        </Button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
