'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
    closeBookingModal,
    setCurrentStep,
    updateCycleDetails,
    addNewCycle,
    updateCustomerDetails,
    setSelectedExistingCycle,
    checkLocationAvailability,
    setTermsAccepted,
    confirmBooking,
    resetOrder,
} from '@/lib/slices/orderSlice';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
import { X, Upload, MapPin, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function BookingModal() {
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        isBookingModalOpen,
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

    const handleClose = () => {
        dispatch(closeBookingModal());
    };

    const handleNext = () => {
        if (currentStep === 'cycle-details') {
            dispatch(setCurrentStep('customer-details'));
        } else if (currentStep === 'customer-details') {
            // Check location availability
            dispatch(checkLocationAvailability(customerDetails.pincode));
            if (isLocationAvailable && termsAccepted) {
                dispatch(confirmBooking());
            }
        }
    };

    const handleTrackBooking = () => {
        dispatch(resetOrder());
        router.push('/track-booking');
    };

    const renderProgressSteps = () => {
        const steps = [
            {
                key: 'cycle-details',
                label:
                    currentStep === 'cycle-details'
                        ? 'Booking Initiated'
                        : 'Your cycle details',
            },
            {
                key: 'customer-details',
                label:
                    currentStep === 'customer-details'
                        ? 'Add Your Details'
                        : 'Your Cycle(s) Details',
            },
            {
                key: 'confirmation',
                label:
                    currentStep === 'confirmation'
                        ? 'Booking confirmed'
                        : 'Technician assigned',
            },
        ];

        return (
            <div className='flex items-center justify-between mb-8 px-4'>
                {steps.map((step, index) => (
                    <div key={step.key} className='flex items-center'>
                        <div
                            className={`w-4 h-4 rounded-full ${
                                currentStep === step.key
                                    ? 'bg-[#fbbf24]'
                                    : steps.findIndex(
                                          (s) => s.key === currentStep
                                      ) > index
                                    ? 'bg-[#fbbf24]'
                                    : 'bg-gray-400'
                            }`}
                        />
                        {index < steps.length - 1 && (
                            <div
                                className={`w-24 h-0.5 mx-2 ${
                                    steps.findIndex(
                                        (s) => s.key === currentStep
                                    ) > index
                                        ? 'bg-[#fbbf24]'
                                        : 'bg-gray-400'
                                }`}
                            />
                        )}
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
            className='space-y-6'
        >
            {isExistingUser && (
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Add existing cycle</Label>
                    <Select
                        value={selectedExistingCycle || ''}
                        onValueChange={(value) =>
                            dispatch(setSelectedExistingCycle(value))
                        }
                    >
                        <SelectTrigger className='w-full'>
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

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Upload your cycle details
                    </h3>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => dispatch(addNewCycle())}
                        className='text-[#fbbf24] hover:text-[#f59e0b]'
                    >
                        + Add more Cycle
                    </Button>
                </div>

                {cycles.map((cycle, index) => (
                    <div
                        key={cycle.id}
                        className='space-y-4 p-4 border border-gray-200 rounded-lg'
                    >
                        {cycles.length > 1 && (
                            <h4 className='font-medium text-gray-900'>
                                Cycle {index + 1}
                            </h4>
                        )}

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label className='text-gray-700'>
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
                                    className='w-full'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-gray-700'>
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
                                    className='flex space-x-4'
                                >
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem
                                            value='gear'
                                            id={`gear-${index}`}
                                        />
                                        <Label htmlFor={`gear-${index}`}>
                                            Gear
                                        </Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem
                                            value='non-gear'
                                            id={`non-gear-${index}`}
                                        />
                                        <Label htmlFor={`non-gear-${index}`}>
                                            Non - gear
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {cycles.length > 1 && (
                            <div className='space-y-2'>
                                <Label className='text-gray-700'>
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
                                    <SelectTrigger className='w-full'>
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
                            <Label className='text-gray-700'>
                                Upload Bicycle photo
                            </Label>
                            <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#fbbf24] transition-colors cursor-pointer'>
                                <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                <p className='text-gray-500 text-sm'>
                                    Click to upload or drag and drop
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                onClick={handleNext}
                className='w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-3 rounded-full'
            >
                Next
            </Button>
        </motion.div>
    );

    const renderCustomerDetailsStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='space-y-6'
        >
            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>First Name*</Label>
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
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Last Name*</Label>
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
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Gender</Label>
                    <RadioGroup
                        value={customerDetails.gender}
                        onValueChange={(value: 'male' | 'female') =>
                            dispatch(updateCustomerDetails({ gender: value }))
                        }
                        className='flex space-x-4'
                    >
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='male' id='male' />
                            <Label htmlFor='male'>Male</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='female' id='female' />
                            <Label htmlFor='female'>Female</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Phone Number*</Label>
                    <Input
                        value={customerDetails.phone}
                        onChange={(e) =>
                            dispatch(
                                updateCustomerDetails({
                                    phone: e.target.value,
                                })
                            )
                        }
                        placeholder='Enter phone number'
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Address line 1*</Label>
                    <Input
                        value={customerDetails.address1}
                        onChange={(e) =>
                            dispatch(
                                updateCustomerDetails({
                                    address1: e.target.value,
                                })
                            )
                        }
                        placeholder='Enter address'
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Locate Yourself</Label>
                    <div className='flex items-center justify-center h-10 border border-gray-300 rounded-md'>
                        <MapPin className='w-5 h-5 text-[#fbbf24]' />
                    </div>
                </div>
            </div>

            <div className='space-y-2'>
                <Label className='text-gray-700'>Address line 2</Label>
                <Input
                    value={customerDetails.address2}
                    onChange={(e) =>
                        dispatch(
                            updateCustomerDetails({
                                address2: e.target.value,
                            })
                        )
                    }
                    placeholder='Enter additional address details'
                />
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>City*</Label>
                    <Input
                        value={customerDetails.city}
                        onChange={(e) =>
                            dispatch(
                                updateCustomerDetails({ city: e.target.value })
                            )
                        }
                        placeholder='Enter city'
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>State*</Label>
                    <Input
                        value={customerDetails.state}
                        onChange={(e) =>
                            dispatch(
                                updateCustomerDetails({ state: e.target.value })
                            )
                        }
                        placeholder='Enter state'
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>Country*</Label>
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
                    />
                </div>
                <div className='space-y-2'>
                    <Label className='text-gray-700'>PIN Code*</Label>
                    <Input
                        value={customerDetails.pincode}
                        onChange={(e) => {
                            dispatch(
                                updateCustomerDetails({
                                    pincode: e.target.value,
                                })
                            );
                            if (e.target.value.length === 6) {
                                dispatch(
                                    checkLocationAvailability(e.target.value)
                                );
                            }
                        }}
                        placeholder='Enter PIN code'
                        className={
                            !isLocationAvailable && customerDetails.pincode
                                ? 'border-red-500'
                                : ''
                        }
                    />
                </div>
            </div>

            {!isLocationAvailable && customerDetails.pincode && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <h4 className='text-red-600 font-semibold mb-2'>Oh!</h4>
                    <p className='text-red-600 text-sm mb-2'>
                        Currently we don't provide service at your locality.
                        Please submit your details so we can{' '}
                        <span className='font-semibold'>contact you</span> or{' '}
                        <span className='font-semibold'>notify you</span> when
                        we will available.
                    </p>
                </div>
            )}

            <div className='flex items-start space-x-2'>
                <Checkbox
                    id='terms'
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                        dispatch(setTermsAccepted(checked as boolean))
                    }
                />
                <Label
                    htmlFor='terms'
                    className='text-sm text-gray-600 leading-relaxed'
                >
                    I accept the{' '}
                    <span className='text-blue-600 underline cursor-pointer'>
                        terms & conditions
                    </span>{' '}
                    set by gearup cycles. I have read all the{' '}
                    <span className='text-blue-600 underline cursor-pointer'>
                        privacy policy
                    </span>
                    .
                </Label>
            </div>

            <Button
                onClick={handleNext}
                disabled={
                    !termsAccepted ||
                    (!isLocationAvailable && customerDetails.pincode.length > 0)
                }
                className='w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {!isLocationAvailable && customerDetails.pincode
                    ? 'Submit'
                    : 'Next'}
            </Button>
        </motion.div>
    );

    const renderConfirmationStep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='text-center space-y-6 py-8'
        >
            <div className='relative'>
                <div className='w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <div className='w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center relative'>
                        <svg
                            width='32'
                            height='24'
                            viewBox='0 0 32 24'
                            className='text-white'
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

            <h2 className='text-2xl font-bold text-gray-900'>
                Your booking has been confirmed
            </h2>

            <div className='flex items-center justify-center space-x-2'>
                <span className='text-gray-600'>
                    You can track your booking
                </span>
                <Button
                    onClick={handleTrackBooking}
                    className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-4 py-1 text-sm rounded-full'
                >
                    Here
                </Button>
            </div>

            {orderId && (
                <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-600'>
                        Order ID:{' '}
                        <span className='font-semibold'>{orderId}</span>
                    </p>
                </div>
            )}
        </motion.div>
    );

    return (
        <Dialog open={isBookingModalOpen} onOpenChange={handleClose}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
                {/* Header */}
                <div className='bg-black text-white p-4 flex items-center justify-between'>
                    <div className='text-center flex-1'>
                        <h2 className='text-lg font-semibold text-[#fbbf24]'>
                            {selectedService?.name} -{' '}
                            {selectedService?.type === 'gear'
                                ? 'Gear'
                                : 'Non Gear'}{' '}
                            Bicycle
                        </h2>
                        <p className='text-sm text-gray-300'>
                            Confirm Your booking
                        </p>
                    </div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleClose}
                        className='text-white hover:bg-gray-800'
                    >
                        <X className='w-5 h-5' />
                    </Button>
                </div>

                {/* Progress Steps */}
                {currentStep !== 'confirmation' && renderProgressSteps()}

                {/* Content */}
                <div className='p-6'>
                    <AnimatePresence mode='wait'>
                        {currentStep === 'cycle-details' &&
                            renderCycleDetailsStep()}
                        {currentStep === 'customer-details' &&
                            renderCustomerDetailsStep()}
                        {currentStep === 'confirmation' &&
                            renderConfirmationStep()}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
