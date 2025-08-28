'use client';

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ErrorBoundary from '@/components/error-boundry';
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
import type { RootState, AppDispatch } from '@/lib/store';
import { addOrderAction } from '@/lib/actions/orderActions';
import {
    updateCycleDetails,
    addNewCycle,
    updateCustomerDetails,
    setSelectedExistingCycle,
    checkLocationAvailability,
    setTermsAccepted,
    setCurrentStep,
    setSelectedService,
    setLoading,
} from '@/lib/slices/orderSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Upload, MapPin } from 'lucide-react';
import Image from 'next/image';

function Book() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

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

        const serviceId = searchParams.get('serviceId');
        const serviceType = searchParams.get('type') as 'gear' | 'non-gear';
        const serviceName = searchParams.get('name');
        const servicePrice = searchParams.get('price');

        if (serviceId && serviceName && servicePrice && !selectedService) {
            dispatch(
                setSelectedService({
                    id: Number.parseInt(serviceId),
                    name: serviceName,
                    type: serviceType || 'gear',
                    price: Number.parseInt(servicePrice),
                })
            );
        }

        // Pre-fill customer details from user data
        if (user && !customerDetails.firstName) {
            dispatch(
                updateCustomerDetails({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    address1: user.address1 || '',
                    address2: user.address2 || '',
                    cityId: user.cityId || '',
                    // state: user.state || '',
                    // country: user.country || '',
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

    useEffect(() => {
        if (!searchParams.get('serviceId')) {
            router.push('/');
        }
    }, [selectedService]);
    console.log('Selected Service:', selectedService);

    const validateRequiredFields = useCallback(() => {
        const errors: Record<string, string> = {};

        if (currentStep === 'cycle-details') {
            cycles.forEach((cycle, index) => {
                if (!cycle.brand.trim()) {
                    errors[`cycle-${index}-brand`] = 'Cycle brand is required';
                }
                if (!cycle.type) {
                    errors[`cycle-${index}-type`] = 'Cycle type is required';
                }
            });
        } else if (currentStep === 'customer-details') {
            if (!customerDetails.firstName.trim()) {
                errors.firstName = 'First name is required';
            }
            if (!customerDetails.lastName.trim()) {
                errors.lastName = 'Last name is required';
            }
            if (!customerDetails.email?.trim()) {
                errors.email = 'Email is required';
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)
            ) {
                errors.email = 'Please enter a valid email address';
            }
            if (!customerDetails.phone.trim()) {
                errors.phone = 'Phone number is required';
            } else if (
                !/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ''))
            ) {
                errors.phone = 'Phone number must be exactly 10 digits';
            }
            if (!customerDetails.address1.trim()) {
                errors.address1 = 'Address line 1 is required';
            }
            if (customerDetails.cityId === '') {
                errors.cityId = 'City is required';
            }
            if (!isLocationAvailable || !customerDetails.longLat?.trim()) {
                errors.longLat = 'Please locate yourself';
            }
            // if (!customerDetails.state.trim()) {
            //     errors.state = 'State is required';
            // }
            // if (!customerDetails.country.trim()) {
            //     errors.country = 'Country is required';
            // }
            if (!customerDetails.pinCode.trim()) {
                errors.pinCode = 'PIN code is required';
            } else if (!/^\d{6}$/.test(customerDetails.pinCode)) {
                errors.pinCode = 'PIN code must be exactly 6 digits';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [currentStep, cycles, customerDetails]);

    const handleFileUpload = useCallback(
        (index: number, file: File) => {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    dispatch(
                        updateCycleDetails({
                            index,
                            field: 'image',
                            value: file, // Store the actual file object
                        })
                    );
                    // Clear validation error for this field
                    setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[`cycle-${index}-photo`];
                        return newErrors;
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        [dispatch]
    );

    const handleRemoveImage = useCallback(
        (index: number) => {
            dispatch(
                updateCycleDetails({
                    index,
                    field: 'image',
                    value: null,
                })
            );
        },
        [dispatch]
    );

    console.log(cycles);

    const handleNext = useCallback(() => {
        if (!validateRequiredFields()) {
            return;
        }

        if (currentStep === 'customer-details') {
            dispatch(setCurrentStep('cycle-details'));
        } else if (currentStep === 'cycle-details') {
            if (!termsAccepted) {
                setValidationErrors({
                    terms: 'Please accept terms and conditions',
                });
                return;
            }

            if (!isLocationAvailable && customerDetails.pinCode.length > 0) {
                setValidationErrors({});
            }

            if (selectedService) {
                dispatch(setLoading(true));

                const formData = new FormData();

                // Add basic order data
                formData.append(
                    'customer',
                    JSON.stringify({
                        firstName: customerDetails.firstName,
                        lastName: customerDetails.lastName,
                        email: customerDetails.email || '',
                        gender: customerDetails.gender,
                        phone: customerDetails.phone,
                        address1: customerDetails.address1,
                        address2: customerDetails.address2,
                        cityId: customerDetails.cityId,
                        // state: customerDetails.state,
                        // country: customerDetails.country,
                        pinCode: customerDetails.pinCode,
                    })
                );

                formData.append(
                    'order',
                    JSON.stringify({
                        cycles: cycles.map((cycle, index) => ({
                            id: cycle.id ?? undefined,
                            brand: cycle.brand,
                            type: cycle.type,
                            image:
                                cycle.image instanceof File ? '' : cycle.image,
                            isNew: true,
                            service_id: selectedService.id,
                        })),
                    })
                );

                // cycles.forEach((cycle, index) => {
                //     if (cycle.image instanceof File) {
                //         formData.append(`file`, cycle.image);
                //     }
                // });

                cycles.forEach((cycle, index) => {
                    if (cycle.image instanceof File) {
                        const cycleName = cycle.brand || `cycle${index + 1}`;
                        const fileExt = cycle.image.type.split('/')[1] || 'jpg';
                        const renamedFile = new File(
                            [cycle.image],
                            `${cycle.id ?? index}_${cycleName
                                .toLowerCase()
                                .replace(/\s+/g, '_')}.${fileExt}`,
                            { type: cycle.image.type }
                        );
                        formData.append(`file`, renamedFile);
                    }
                });

                // // Add cycle data and images
                // cycles.forEach((cycle, index) => {
                //     formData.append(`cycles[${index}][brand]`, cycle.brand);
                //     formData.append(`cycles[${index}][type]`, cycle.type);
                //     formData.append(
                //         `cycles[${index}][serviceId]`,
                //         String(selectedService.id)
                //     );
                //     formData.append(`cycles[${index}][order]`, 'true');

                //     if (cycle.image instanceof File) {
                //         formData.append(`cycles[${index}][image]`, cycle.image);
                //     }
                // });

                dispatch(addOrderAction(formData))
                    .unwrap()
                    .then(() => {
                        // Success handled by reducer
                        dispatch(setLoading(false));
                    })
                    .catch((error) => {
                        console.error('Booking submission failed:', error);
                        dispatch(setLoading(false));
                    });
            }
        }
    }, [
        validateRequiredFields,
        currentStep,
        termsAccepted,
        isLocationAvailable,
        customerDetails,
        user,
        selectedService,
        cycles,
        dispatch,
    ]);

    const handlePrevStep = () => {
        if (currentStep === 'customer-details') {
            router.push('/');
        } else if (currentStep === 'cycle-details') {
            dispatch(setCurrentStep('customer-details'));
        }
    };

    const progressSteps = useMemo(() => {
        const steps = [
            {
                key: 'customer-details',
                label: 'Add Your Details',
            },
            {
                key: 'cycle-details',
                label: 'Booking Initiated',
            },
            {
                key: 'confirmation',
                label: 'Booking Confirmed',
            },
        ];

        const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

        return (
            <div className='flex items-start justify-center w-full max-w-2xl mx-auto px-4 mb-12'>
                {steps.map((step, index) => {
                    const isCompleted = currentStepIndex > index;
                    const isActive = currentStepIndex === index;

                    return (
                        <>
                            <div
                                key={step.key}
                                className='flex flex-col items-center text-center w-28'
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300
                                ${
                                    isCompleted || isActive
                                        ? 'bg-amber-400 text-black'
                                        : 'bg-gray-600 text-white'
                                }`}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </div>

                                <p
                                    className={`mt-2 text-xs font-medium transition-colors duration-300
                                ${
                                    isActive
                                        ? 'text-amber-400'
                                        : 'text-gray-400'
                                }`}
                                >
                                    {step.label}
                                </p>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mt-3 transition-colors duration-300
                                ${
                                    isCompleted ? 'bg-amber-400' : 'bg-gray-600'
                                }`}
                                />
                            )}
                        </>
                    );
                })}
            </div>
        );
    }, [currentStep]);

    const renderProgressSteps = () => progressSteps;

    const renderCycleDetailsStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='max-w-4xl mx-auto p-4'
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
                                    <SelectItem
                                        key={cycle.id ?? ''}
                                        value={cycle?.id?.toString() || ''}
                                    >
                                        {cycle.brand} - {cycle.type} (
                                        {cycle.serviceId})
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
                            disabled
                            variant='ghost'
                            size='sm'
                            onClick={() => dispatch(addNewCycle())}
                            className='text-[#fbbf24] hover:text-[#f59e0b] hover:bg-[#2a2b2d]'
                        >
                            + Add more Cycle
                        </Button>
                    </div>

                    {cycles.map((cycle, index) => (
                        <div key={cycle.id} className='space-y-4'>
                            {cycles.length > 1 && (
                                <h4 className='font-medium text-black'>
                                    Cycle {index + 1}
                                </h4>
                            )}

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label className='text-black'>
                                        Cycle Brand*
                                    </Label>
                                    <Input
                                        required
                                        value={cycle.brand}
                                        onChange={(e) => {
                                            dispatch(
                                                updateCycleDetails({
                                                    index,
                                                    field: 'brand',
                                                    value: e.target.value,
                                                })
                                            );
                                            if (
                                                validationErrors[
                                                    `cycle-${index}-brand`
                                                ]
                                            ) {
                                                setValidationErrors((prev) => {
                                                    const newErrors = {
                                                        ...prev,
                                                    };
                                                    delete newErrors[
                                                        `cycle-${index}-brand`
                                                    ];
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        placeholder='Enter brand name'
                                        className={`border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                            validationErrors[
                                                `cycle-${index}-brand`
                                            ]
                                                ? 'border-red-500'
                                                : ''
                                        }`}
                                    />
                                    {validationErrors[
                                        `cycle-${index}-brand`
                                    ] && (
                                        <p className='text-red-500 text-sm'>
                                            {
                                                validationErrors[
                                                    `cycle-${index}-brand`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-black'>
                                        Cycle Type*
                                    </Label>
                                    <RadioGroup
                                        value={cycle.type}
                                        onValueChange={(value) => {
                                            dispatch(
                                                updateCycleDetails({
                                                    index,
                                                    field: 'type',
                                                    value,
                                                })
                                            );
                                            if (
                                                validationErrors[
                                                    `cycle-${index}-type`
                                                ]
                                            ) {
                                                setValidationErrors((prev) => {
                                                    const newErrors = {
                                                        ...prev,
                                                    };
                                                    delete newErrors[
                                                        `cycle-${index}-type`
                                                    ];
                                                    return newErrors;
                                                });
                                            }
                                        }}
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
                                    {validationErrors[
                                        `cycle-${index}-type`
                                    ] && (
                                        <p className='text-red-500 text-sm'>
                                            {
                                                validationErrors[
                                                    `cycle-${index}-type`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-black'>
                                    Upload Bicycle photo*
                                </Label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-[#fbbf24] transition-colors cursor-pointer ${
                                        validationErrors[`cycle-${index}-photo`]
                                            ? 'border-red-500'
                                            : 'border-[#4a4b4d]'
                                    }`}
                                >
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileUpload(index, file);
                                            }
                                        }}
                                        className='hidden'
                                        id={`file-upload-${index}`}
                                    />
                                    <label
                                        htmlFor={`file-upload-${index}`}
                                        className='cursor-pointer'
                                    >
                                        {cycle.image instanceof File ? (
                                            <div className='space-y-3'>
                                                <div className='flex items-center justify-center'>
                                                    <img
                                                        src={
                                                            URL.createObjectURL(
                                                                cycle.image
                                                            ) ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt='Cycle preview'
                                                        className='w-24 h-24 object-cover rounded-lg'
                                                    />
                                                </div>
                                                <div className='flex items-center justify-center space-x-2'>
                                                    <CheckCircle2 className='w-5 h-5 text-green-500' />
                                                    <span className='text-green-600 text-sm font-medium'>
                                                        {cycle.image.name}
                                                    </span>
                                                </div>
                                                <div className='flex items-center justify-center space-x-2'>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            document
                                                                .getElementById(
                                                                    `file-upload-${index}`
                                                                )
                                                                ?.click();
                                                        }}
                                                        className='text-[#fbbf24] border-[#fbbf24] hover:bg-[#fbbf24] hover:text-black'
                                                    >
                                                        Change Image
                                                    </Button>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveImage(
                                                                index
                                                            );
                                                        }}
                                                        className='text-red-500 border-red-500 hover:bg-red-500 hover:text-white'
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className='w-8 h-8 text-gray-600 mx-auto mb-2' />
                                                <p className='text-gray-600 text-sm'>
                                                    Click to upload or drag and
                                                    drop
                                                </p>
                                                <p className='text-gray-500 text-xs'>
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {validationErrors[`cycle-${index}-photo`] && (
                                    <p className='text-red-500 text-sm'>
                                        {
                                            validationErrors[
                                                `cycle-${index}-photo`
                                            ]
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex items-start space-x-2 mt-8'>
                    <Checkbox
                        id='terms'
                        checked={termsAccepted}
                        onCheckedChange={(checked) => {
                            dispatch(setTermsAccepted(checked as boolean));
                            if (validationErrors.terms) {
                                setValidationErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.terms;
                                    return newErrors;
                                });
                            }
                        }}
                        className='border-[#fbbf24] data-[state=checked]:bg-[#fbbf24] data-[state=checked]:text-black shrink-0'
                    />
                    <Label
                        htmlFor='terms'
                        className='text-xs text-gray-600 leading-relaxed flex flex-wrap'
                    >
                        I accept the{' '}
                        <span className='text-[#fbbf24] underline cursor-pointer'>
                            terms & conditions
                        </span>
                        set by GearGrow Cycle. I have read all the{' '}
                        <span className='text-[#fbbf24] underline cursor-pointer'>
                            privacy policy
                        </span>
                        .
                    </Label>
                </div>
                {validationErrors.terms && (
                    <p className='text-red-500 text-sm mt-2'>
                        {validationErrors.terms}
                    </p>
                )}

                {error && (
                    <div className='mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg'>
                        <p className='text-red-300 text-sm'>{error}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderCustomerDetailsStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='max-w-4xl mx-auto p-4'
        >
            <div className='text-black'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>First Name*</Label>
                        <Input
                            value={customerDetails.firstName}
                            onChange={(e) => {
                                dispatch(
                                    updateCustomerDetails({
                                        firstName: e.target.value,
                                    })
                                );
                                if (validationErrors.firstName) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.firstName;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder='Enter first name'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                validationErrors.firstName
                                    ? 'border-red-500'
                                    : ''
                            }`}
                        />
                        {validationErrors.firstName && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.firstName}
                            </p>
                        )}
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>Last Name*</Label>
                        <Input
                            value={customerDetails.lastName}
                            onChange={(e) => {
                                dispatch(
                                    updateCustomerDetails({
                                        lastName: e.target.value,
                                    })
                                );
                                if (validationErrors.lastName) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.lastName;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder='Enter last name'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                validationErrors.lastName
                                    ? 'border-red-500'
                                    : ''
                            }`}
                        />
                        {validationErrors.lastName && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.lastName}
                            </p>
                        )}
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>Email Address*</Label>
                        <Input
                            type='email'
                            value={customerDetails.email || ''}
                            onChange={(e) => {
                                dispatch(
                                    updateCustomerDetails({
                                        email: e.target.value,
                                    })
                                );
                                if (validationErrors.email) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.email;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder='Enter email address'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                validationErrors.email ? 'border-red-500' : ''
                            }`}
                        />
                        {validationErrors.email && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.email}
                            </p>
                        )}
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>Phone Number*</Label>
                        <Input
                            type='tel'
                            value={customerDetails.phone}
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 10);
                                dispatch(
                                    updateCustomerDetails({
                                        phone: value,
                                    })
                                );
                                if (validationErrors.phone) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.phone;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder='Enter 10-digit phone number'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                validationErrors.phone ? 'border-red-500' : ''
                            }`}
                        />
                        {validationErrors.phone && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.phone}
                            </p>
                        )}
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
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>Address line 1*</Label>
                        <Input
                            value={customerDetails.address1}
                            onChange={(e) => {
                                dispatch(
                                    updateCustomerDetails({
                                        address1: e.target.value,
                                    })
                                );
                                if (validationErrors.address1) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.address1;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder='Enter address'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                validationErrors.address1
                                    ? 'border-red-500'
                                    : ''
                            }`}
                        />
                        {validationErrors.address1 && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.address1}
                            </p>
                        )}
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-black'>Locate Yourself</Label>
                        <div className='flex items-center space-x-2'>
                            <Button
                                type='button'
                                variant='outline'
                                className='border-[#4a4b4d] text-[#fbbf24] bg-white hover:bg-[#fbbf24] hover:text-black flex items-center'
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                const { latitude, longitude } =
                                                    position.coords;
                                                dispatch(
                                                    updateCustomerDetails({
                                                        longLat: `${longitude},${latitude}`,
                                                    })
                                                );
                                            },
                                            (error) => {
                                                alert(
                                                    'Unable to get location: ' +
                                                        error.message
                                                );
                                            }
                                        );
                                    } else {
                                        alert(
                                            'Geolocation is not supported by your browser.'
                                        );
                                    }
                                }}
                            >
                                <MapPin className='w-5 h-5 mr-2' />
                                Locate Me
                            </Button>
                            {customerDetails.longLat && (
                                <span className='text-xs text-gray-600'>
                                    Location set ✓: {customerDetails.longLat}
                                </span>
                            )}
                        </div>
                        {validationErrors.longLat && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.longLat}
                            </p>
                        )}
                    </div>
                </div>

                <div className='mt-6'>
                    <Label className='text-black'>Address line 2</Label>
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
                        className='bg-white border-[#4a4b4d] text-black placeholder:text-gray-600'
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='space-y-2'>
                        <Label className='text-black'>City*</Label>
                        <Select
                            // className='w-full'
                            defaultValue='2'
                            value={customerDetails.cityId?.toString() || ''}
                            onValueChange={(value) => {
                                dispatch(
                                    updateCustomerDetails({
                                        cityId: value,
                                    })
                                );
                                if (validationErrors.cityId) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.cityId;
                                        return newErrors;
                                    });
                                }
                            }}
                        >
                            <SelectTrigger
                                className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 w-full ${
                                    validationErrors.cityId
                                        ? 'border-red-500'
                                        : ''
                                }`}
                            >
                                <SelectValue placeholder='Select city' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='3'>Pune</SelectItem>
                                <SelectItem value='1'>Mumbai</SelectItem>
                                <SelectItem value='4'>Bengaluru</SelectItem>
                            </SelectContent>
                        </Select>
                        {validationErrors.cityId && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.cityId}
                            </p>
                        )}
                    </div>
                    {/* <div className='space-y-2'>
                        <Label className='text-black'>State*</Label>
                        <Select
                            value={customerDetails.state}
                            onValueChange={(value) => {
                                dispatch(
                                    updateCustomerDetails({
                                        state: value,
                                    })
                                );
                                if (validationErrors.state) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.state;
                                        return newErrors;
                                    });
                                }
                            }}
                        >
                            <SelectTrigger
                                className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 w-full ${
                                    validationErrors.state
                                        ? 'border-red-500'
                                        : ''
                                }`}
                            >
                                <SelectValue placeholder='Select state' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='maharashtra'>
                                    Maharashtra
                                </SelectItem>
                                <SelectItem value='karnataka'>
                                    Karnataka
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {validationErrors.state && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.state}
                            </p>
                        )}
                    </div> */}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    {/* <div className='space-y-2'>
                        <Label className='text-black'>Country*</Label>
                        <Input
                            value={customerDetails.country}
                            onChange={(e) => {
                                dispatch(
                                    updateCustomerDetails({
                                        country: e.target.value,
                                    })
                                );
                                if (validationErrors.country) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.country;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder='Enter country'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                validationErrors.country ? 'border-red-500' : ''
                            }`}
                        />
                        {validationErrors.country && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.country}
                            </p>
                        )}
                    </div> */}
                    <div className='space-y-2'>
                        <Label className='text-black'>PIN Code*</Label>
                        <Input
                            type='text'
                            value={customerDetails.pinCode}
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 6);
                                dispatch(
                                    updateCustomerDetails({
                                        pinCode: value,
                                    })
                                );
                                if (validationErrors.pinCode) {
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.pinCode;
                                        return newErrors;
                                    });
                                }
                                if (value.length === 6) {
                                    dispatch(checkLocationAvailability(value));
                                }
                            }}
                            placeholder='Enter 6-digit PIN code'
                            className={`bg-white border-[#4a4b4d] text-black placeholder:text-gray-600 ${
                                (!isLocationAvailable &&
                                    customerDetails.pinCode) ||
                                validationErrors.pinCode
                                    ? 'border-red-500'
                                    : ''
                            }`}
                        />
                        {validationErrors.pinCode && (
                            <p className='text-red-500 text-sm'>
                                {validationErrors.pinCode}
                            </p>
                        )}
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
            className='text-center space-y-8 max-w-2xl mx-auto p-4'
        >
            <div className='rounded-lg'>
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
        <ErrorBoundary>
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
                        <div className='px-4'>{renderProgressSteps()}</div>

                        {/* Step Content */}
                        <AnimatePresence mode='wait'>
                            {currentStep === 'customer-details' &&
                                renderCustomerDetailsStep()}
                            {currentStep === 'cycle-details' &&
                                renderCycleDetailsStep()}
                            {currentStep === 'confirmation' &&
                                renderConfirmationStep()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        {currentStep !== 'confirmation' && (
                            <div className='flex justify-between lg:justify-center gap-2 mt-12 max-w-4xl lg:max-w-full mx-4'>
                                <Button
                                    onClick={handlePrevStep}
                                    variant='outline'
                                    className='border-[#4a4b4d] text-white hover:bg-[#2a2b2d] px-8 py-3 bg-black'
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        isLoading ||
                                        (currentStep === 'cycle-details' &&
                                            !termsAccepted)
                                    }
                                    className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isLoading ? (
                                        <div className='flex items-center gap-2'>
                                            <div className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin'></div>
                                            Submitting...
                                        </div>
                                    ) : currentStep === 'cycle-details' ? (
                                        'Submit Booking'
                                    ) : (
                                        'Next'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </ErrorBoundary>
    );
}

export default function BookPage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
                <Book />
            </Suspense>
        </ErrorBoundary>
    );
}
