'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RootState, AppDispatch } from '@/lib/store';
import {
    getUserByIdAction,
    updateCustomerAction,
} from '@/lib/actions/userActions';
import { getCitiesAction } from '@/lib/actions/cityActions';
import {
    ChevronDown,
    ChevronUp,
    Edit2,
    Calendar,
    MapPin,
    Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    cancelOrderAction,
    getOrdersByUserIdAction,
} from '@/lib/actions/orderActions';
import { getLocaleStorage } from '@/lib/utils';

// const cities = [
//     { id: 3, name: 'Pune' },
//     { id: 1, name: 'Mumbai' },
//     { id: 4, name: 'Bengalore' },
// ];

// const cityMetaById = {
//     1: { name: 'Mumbai', state: 'Maharashtra', country: 'India' },
//     3: { name: 'Pune', state: 'Maharashtra', country: 'India' },
//     4: { name: 'Bengalore', state: 'Karnataka', country: 'India' },
// } as const;

function getCityNameFromId(id: unknown, cities: any[]) {
    const cid = typeof id === 'string' ? Number.parseInt(id, 10) : Number(id);
    if (Number.isNaN(cid)) return '';
    const match = cities.find((c) => c.id === cid);
    return match?.name || '';
}

const STATUS_STEPS = [
    'Pending',
    'Accepted',
    'Assigned',
    'Started',
    'Completed',
] as const;
type NormalizedStatus = (typeof STATUS_STEPS)[number] | 'Cancelled';

const ACTIVITY_TO_STATUS: Record<string, NormalizedStatus> = {
    ORDER_CREATED: 'Pending',
    ORDER_ACCEPTED: 'Accepted',
    ORDER_ASSIGNED: 'Assigned',
    ORDER_STARTED: 'Started',
    ORDER_COMPLETED: 'Completed',
    ORDER_CANCELLED: 'Cancelled',
    CALL_DIALED: 'Started',
    MAP_CHECKED: 'Started',
};

function formatDate(iso?: string | null) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatDateTime(iso?: string | null) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Normalize status using explicit status field or infer from activity.
 */
function normalizeOrderStatus(order: any): NormalizedStatus {
    const direct = String(order?.status ?? '')
        .trim()
        .toLowerCase();
    const directMap: Record<string, NormalizedStatus> = {
        pending: 'Pending',
        accepted: 'Accepted',
        assigned: 'Assigned',
        started: 'Started',
        completed: 'Completed',
        cancelled: 'Cancelled',
        canceled: 'Cancelled',
    };
    if (directMap[direct]) return directMap[direct];

    if (Array.isArray(order?.activity) && order.activity.length > 0) {
        const timeline = [...order.activity].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
        let status: NormalizedStatus = 'Pending';
        for (const ev of timeline) {
            const mapped =
                ACTIVITY_TO_STATUS[String(ev?.state || '').toUpperCase()];
            if (mapped) status = mapped;
        }
        return status;
    }
    return 'Pending';
}

/**
 * Determine progress index (0..steps.length-1). For Cancelled, use last non-cancelled progress.
 */
function getProgressIndex(order: any): number {
    const status = normalizeOrderStatus(order);
    if (status !== 'Cancelled') {
        return Math.max(0, STATUS_STEPS.indexOf(status as any));
    }
    // If cancelled, compute the last achieved step from activity (excluding Cancelled)
    if (Array.isArray(order?.activity) && order.activity.length > 0) {
        const timeline = [...order.activity].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
        let idx = 0;
        for (const ev of timeline) {
            const mapped =
                ACTIVITY_TO_STATUS[String(ev?.state || '').toUpperCase()];
            if (mapped && mapped !== 'Cancelled') {
                const stepIdx = STATUS_STEPS.indexOf(mapped as any);
                if (stepIdx > idx) idx = stepIdx;
            }
        }
        return idx;
    }
    return 0;
}

export function Account() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const {
        isAuthenticated,
        user,
        isLoading: userLoading,
        error,
    } = useSelector((state: RootState) => state.auth);
    const { orders, isLoading } = useSelector(
        (state: RootState) => state.order
    );
    const { cities } = useSelector((state: any) => state.city);
    console.log();

    const [activeTab, setActiveTab] = useState(tab ? tab : 'profile');

    useEffect(() => {
        if (activeTab === 'orders' && isAuthenticated) {
            dispatch(getOrdersByUserIdAction());
        }
        if (activeTab === 'profile' && isAuthenticated) {
            dispatch(getUserByIdAction());
            dispatch(getCitiesAction());
        }
    }, [activeTab, router, isAuthenticated, dispatch]);
    const [isEditing, setIsEditing] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [editedProfile, setEditedProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        address1: '',
        address2: '',
        city: null as number | null,
        state: '',
        country: '',
        pincode: '',
        phone: '',
    });

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    const derivedCity = useMemo(() => {
        const input = editedProfile.city;
        if (!input) return null;

        // If the input is an ID-like value
        const id = Number(input);
        const matchById = cities.find((c: any) => c.id === id);
        if (!Number.isNaN(id) && matchById) {
            return matchById;
        }

        // Otherwise, try by name (case-insensitive)
        const matchByName = cities.find(
            (c: any) => c.name.toLowerCase() === String(input).toLowerCase()
        );
        if (matchByName) {
            return matchByName;
        }
        return null;
    }, [editedProfile.city, cities]);

    const cityInfo = useMemo(() => {
        if (user) {
            const cityMeta =
                derivedCity ||
                (user.cityId !== undefined
                    ? cities.find((c: any) => c.id === user.cityId)
                    : undefined);
            return {
                city: cityMeta?.name || '',
                state: cityMeta?.state || '',
                country: cityMeta?.country || '',
            };
        }
        return { city: '', state: '', country: '' };
    }, [user, derivedCity, cities]);

    useEffect(() => {
        if (!user && (isAuthenticated || getLocaleStorage('token'))) {
            dispatch(getUserByIdAction());
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            // Initialize profile form
            setEditedProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                gender: user.gender || '',
                address1: user.address1 || '',
                address2: user.address2 || '',
                city: user.cityId || null,
                pincode: user.pincode || '',
                phone: user.phone || '',
                state: '', // kept to avoid structural changes in form
                country: '', // kept to avoid structural changes in form
            });
            setValidationErrors({});
        }
    }, [isAuthenticated, user, router, dispatch]);

    const clearFieldError = (field: string) => {
        if (!validationErrors[field]) return;
        setValidationErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleSaveProfile = async () => {
        const errors: Record<string, string> = {};
        const emailRe = /^\S+@\S+\.\S+$/;

        const firstName = editedProfile.firstName.trim();
        const lastName = editedProfile.lastName.trim();
        const email = editedProfile.email.trim();
        const gender = editedProfile.gender.trim();
        const address1 = editedProfile.address1.trim();
        const phone = (editedProfile.phone || '')
            .replace(/\D/g, '')
            .slice(0, 10);
        const pincode = (editedProfile.pincode || '')
            .replace(/\D/g, '')
            .slice(0, 6);

        if (!firstName) errors.firstName = 'First name is required';
        if (!lastName) errors.lastName = 'Last name is required';
        if (firstName.length < 2)
            errors.firstName =
                'First name should be at least 2 characters long';
        if (lastName.length < 2)
            errors.lastName = 'Last name should be at least 2 characters long';

        if (!email) errors.email = 'Email is required';
        else if (!emailRe.test(email))
            errors.email = 'Enter a valid email address';

        if (!gender) errors.gender = 'Please select your gender';

        if (!phone) errors.phone = 'Phone is required';
        else if (phone.length !== 10)
            errors.phone = 'Enter a 10-digit phone number';

        if (!address1 || address1.length < 2)
            errors.address1 = 'Address line 1 is required';

        if (!editedProfile.city) errors.city = 'Please select a city';

        if (!pincode) errors.pincode = 'PIN code is required';
        else if (pincode.length !== 6)
            errors.pincode = 'Enter a 6-digit PIN code';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        if (user && isAuthenticated) {
            const { state, country, ...data } = editedProfile;
            await dispatch(
                updateCustomerAction({
                    ...data,
                    // ensure sanitized before submit
                    phone,
                    pincode,
                })
            );
            setIsEditing(false);
            setValidationErrors({});
        }
    };

    const handleCancelEdit = () => {
        if (user) {
            setEditedProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                gender: user.gender || '',
                address1: user.address1 || '',
                address2: user.address2 || '',
                city: user.cityId || null,
                pincode: user.pincode || '',
                phone: user.phone || '',
                state: editedProfile.state || '',
                country: editedProfile.country || '',
            });
        }
        setIsEditing(false);
        setValidationErrors({});
    };

    const getOrderStatusColor = (status: string) => {
        const s = String(status).trim();
        switch (s) {
            case 'Pending':
                return 'bg-yellow-500';
            case 'Accepted':
                return 'bg-blue-500';
            case 'Assigned':
                return 'bg-indigo-500';
            case 'Started':
                return 'bg-orange-500';
            case 'Completed':
                return 'bg-green-600';
            case 'Cancelled':
                return 'bg-red-600';
            default:
                return 'bg-gray-500';
        }
    };

    const getOrderStatusText = (status: string) => {
        return String(status).trim();
    };

    const renderOrderProgress = (order: any) => {
        const norm = normalizeOrderStatus(order);
        const currentStepIndex = getProgressIndex(order);
        const isCancelled = norm === 'Cancelled';

        return (
            <div className='flex items-center justify-between mb-6 px-4'>
                {STATUS_STEPS.map((step, index) => {
                    const reached = index <= currentStepIndex;
                    return (
                        <div key={step} className='flex items-center'>
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    reached
                                        ? isCancelled
                                            ? 'bg-red-500'
                                            : 'bg-[#fbbf24]'
                                        : 'bg-gray-600'
                                }`}
                                aria-label={step}
                                title={step}
                            />
                            {index < STATUS_STEPS.length - 1 && (
                                <div
                                    className={`w-16 h-0.5 mx-2 ${
                                        index < currentStepIndex
                                            ? isCancelled
                                                ? 'bg-red-500'
                                                : 'bg-[#fbbf24]'
                                            : 'bg-gray-600'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
                {isCancelled && (
                    <Badge className='ml-3 bg-red-600 text-white rounded-none'>
                        Cancelled
                    </Badge>
                )}
            </div>
        );
    };

    const renderProfileTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-6'
        >
            <Card className='bg-white rounded-none'>
                <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                            Profile
                        </h3>
                        {!isEditing && (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    setIsEditing(true);
                                    setValidationErrors({});
                                }}
                                className='text-gray-600 hover:text-gray-900'
                            >
                                <Edit2 className='w-5 h-5' />
                            </Button>
                        )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>First Name</Label>
                            <Input
                                value={editedProfile.firstName}
                                onChange={(e) => {
                                    setEditedProfile({
                                        ...editedProfile,
                                        firstName: e.target.value,
                                    });
                                    clearFieldError('firstName');
                                }}
                                disabled={!isEditing}
                                className={`bg-gray-50 text-black ${
                                    validationErrors.firstName
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                }`}
                            />
                            {validationErrors.firstName && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.firstName}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>Last Name</Label>
                            <Input
                                value={editedProfile.lastName}
                                onChange={(e) => {
                                    setEditedProfile({
                                        ...editedProfile,
                                        lastName: e.target.value,
                                    });
                                    clearFieldError('lastName');
                                }}
                                disabled={!isEditing}
                                className={`bg-gray-50 text-black ${
                                    validationErrors.lastName
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                }`}
                            />
                            {validationErrors.lastName && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.lastName}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2 '>
                            <Label className='text-gray-700'>Email</Label>
                            <Input
                                type='email'
                                value={editedProfile.email}
                                onChange={(e) => {
                                    setEditedProfile({
                                        ...editedProfile,
                                        email: e.target.value,
                                    });
                                    clearFieldError('email');
                                }}
                                disabled={!isEditing}
                                className={`bg-gray-50 text-black ${
                                    validationErrors.email
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                }`}
                            />
                            {validationErrors.email && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2 '>
                            <Label className='text-gray-700'>Phone</Label>
                            <Input
                                type='tel'
                                value={editedProfile.phone}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 10);
                                    setEditedProfile({
                                        ...editedProfile,
                                        phone: value,
                                    });
                                    clearFieldError('phone');
                                }}
                                disabled={!isEditing}
                                placeholder='Enter 10-digit phone number'
                                className={`bg-gray-50 text-black ${
                                    validationErrors.phone
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                }`}
                            />
                            {validationErrors.phone && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.phone}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>Gender</Label>
                            <select
                                value={editedProfile.gender}
                                onChange={(e) => {
                                    setEditedProfile({
                                        ...editedProfile,
                                        gender: e.target.value,
                                    });
                                    clearFieldError('gender');
                                }}
                                disabled={!isEditing}
                                className={`bg-gray-50 text-black rounded-md px-3 py-2 w-full border ${
                                    validationErrors.gender
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                } ${
                                    !isEditing
                                        ? 'cursor-not-allowed text-gray-400 bg-gray-100'
                                        : ''
                                }`}
                            >
                                <option value='' disabled>
                                    Select Gender
                                </option>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                            </select>
                            {validationErrors.gender && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.gender}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <Label className='text-gray-700'>
                                Address line 1
                            </Label>
                            <Input
                                value={editedProfile.address1}
                                onChange={(e) => {
                                    setEditedProfile({
                                        ...editedProfile,
                                        address1: e.target.value,
                                    });
                                    clearFieldError('address1');
                                }}
                                disabled={!isEditing}
                                className={`bg-gray-50 text-black ${
                                    validationErrors.address1
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                }`}
                            />
                            {validationErrors.address1 && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.address1}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <Label className='text-gray-700'>
                                Address line 2
                            </Label>
                            <Input
                                value={editedProfile.address2}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        address2: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>City</Label>
                            <select
                                value={editedProfile.city ?? ''}
                                onChange={(e) => {
                                    setEditedProfile({
                                        ...editedProfile,
                                        city: e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    });
                                    clearFieldError('city');
                                }}
                                disabled={!isEditing}
                                className={`bg-gray-50 text-black rounded-md px-3 py-2 w-full border ${
                                    validationErrors.city
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                } ${
                                    !isEditing
                                        ? 'cursor-not-allowed text-gray-400 bg-gray-100'
                                        : ''
                                }`}
                            >
                                <option
                                    value=''
                                    className={`text-gray-500 text-sm ${
                                        !isEditing
                                            ? 'bg-gray-100 text-gray-400'
                                            : ''
                                    }`}
                                    disabled
                                >
                                    Select City
                                </option>
                                {cities.map((city: any) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {derivedCity && (
                                <p className='text-xs text-gray-600'>
                                    {'Detected location: '}
                                    {derivedCity.name}
                                    {', '}
                                    {derivedCity.state}
                                    {', '}
                                    {derivedCity.country}
                                </p>
                            )}
                            {validationErrors.city && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.city}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>State</Label>
                            <Input
                                value={cityInfo.state}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        state: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>Country</Label>
                            <Input
                                value={cityInfo.country}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        country: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>PIN code</Label>
                            <Input
                                value={editedProfile.pincode}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6);
                                    setEditedProfile({
                                        ...editedProfile,
                                        pincode: value,
                                    });
                                    clearFieldError('pincode');
                                }}
                                disabled={!isEditing}
                                placeholder='Enter 6-digit PIN code'
                                className={`bg-gray-50 text-black ${
                                    validationErrors.pincode
                                        ? 'border-red-500'
                                        : 'border-gray-200'
                                }`}
                            />
                            {validationErrors.pincode && (
                                <p className='text-red-500 text-sm'>
                                    {validationErrors.pincode}
                                </p>
                            )}
                        </div>
                    </div>
                    {isEditing && (
                        <div className='flex space-x-2 mt-4 w-full justify-center'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleCancelEdit}
                                className='text-gray-600 bg-transparent'
                            >
                                Cancel
                            </Button>
                            <Button
                                size='sm'
                                onClick={handleSaveProfile}
                                className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black'
                            >
                                Save
                            </Button>
                        </div>
                    )}
                    {!userLoading &&
                        (error !== '' || error !== null) &&
                        isEditing && (
                            <p className='text-red-500 text-sm text-center mt-4'>
                                {error}
                            </p>
                        )}
                </CardContent>
            </Card>
        </motion.div>
    );

    const renderMyOrdersTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-6'
        >
            <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-white'>My Orders</h3>
            </div>

            {isLoading && (
                <div className='space-y-3'>
                    <div className='h-24 bg-gray-700/40 animate-pulse' />
                    <div className='h-24 bg-gray-700/40 animate-pulse' />
                </div>
            )}

            <div className='space-y-4'>
                {orders.map((order: any) => {
                    const id = String(order?._id ?? order?.id ?? '');
                    const normStatus = normalizeOrderStatus(order);
                    const progress = renderOrderProgress(order);

                    const techFirst = order?.employee?.firstName || '';
                    const techLast = order?.employee?.lastName || '';
                    const techPhone = order?.employee?.phone || '';

                    const cycleName = order?.cycle?.cycle || '';
                    const cycleType = order?.cycle?.type || '';
                    const serviceName = order?.service?.serviceName || '';
                    const total =
                        order?.totalAmount ?? order?.serviceAmount ?? '';

                    const bookingOn = formatDate(order?.bookingDate);
                    const serviceOn = formatDateTime(order?.serviceDate);
                    const createdOn = formatDateTime(order?.createdAt);
                    const updatedOn = formatDateTime(order?.updatedAt);

                    const receiptId = order?.reciptId || '';

                    const address = [
                        order?.address1,
                        order?.address2,
                        order?.city,
                        order?.state,
                        order?.pincode,
                        order?.country,
                    ]
                        .filter(Boolean)
                        .join(', ');

                    const userPhone = user?.phone || '';

                    const topMessage =
                        normStatus === 'Completed'
                            ? `Service completed on ${
                                  updatedOn || serviceOn || bookingOn
                              }`
                            : normStatus === 'Cancelled'
                            ? `Order cancelled${
                                  updatedOn ? ` on ${updatedOn}` : ''
                              }`
                            : normStatus === 'Assigned' ||
                              normStatus === 'Started'
                            ? `Technician ${[techFirst, techLast]
                                  .filter(Boolean)
                                  .join(' ')} ${
                                  techPhone ? `(${techPhone})` : ''
                              }`
                            : normStatus === 'Accepted'
                            ? 'Technician will be assigned soon'
                            : 'Order received';

                    return (
                        <div key={id}>
                            <Badge
                                className={`${getOrderStatusColor(
                                    normStatus
                                )} text-white rounded-none`}
                            >
                                {getOrderStatusText(normStatus)}
                            </Badge>

                            <Card className='bg-white rounded-none'>
                                <CardContent className='px-4 py-2'>
                                    {/* Progress */}
                                    {/* {progress} */}

                                    <div className='flex items-center justify-between mb-3'>
                                        <span className='text-sm text-gray-600'>
                                            {topMessage}
                                        </span>
                                        <div className='flex items-center gap-2'>
                                            {normStatus !== 'Completed' &&
                                                normStatus !== 'Cancelled' && (
                                                    <>
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                            className='text-white bg-red-600'
                                                            onClick={() => {
                                                                dispatch(
                                                                    cancelOrderAction(
                                                                        {
                                                                            orderId:
                                                                                parseInt(
                                                                                    id
                                                                                ),
                                                                            status: 'Cancelled',
                                                                            reason: 'Cancelled by customer itself',
                                                                        }
                                                                    )
                                                                )
                                                                    .unwrap()
                                                                    .then(
                                                                        () => {
                                                                            dispatch(
                                                                                getOrdersByUserIdAction()
                                                                            );
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (e) => {
                                                                            console.log(
                                                                                e
                                                                            );
                                                                        }
                                                                    );
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        {/* <Button
                                                            variant='outline'
                                                            size='sm'
                                                            className='text-gray-600 border-gray-300 bg-transparent'
                                                            onClick={() => {
                                                                // TODO: implement reschedule via dispatch when action is available
                                                                // dispatch(rescheduleOrderAction({ id: order._id }))
                                                            }}
                                                        >
                                                            Reschedule
                                                        </Button> */}
                                                    </>
                                                )}
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() =>
                                                    setExpandedOrder(
                                                        expandedOrder === id
                                                            ? null
                                                            : id
                                                    )
                                                }
                                                className='text-gray-600'
                                                aria-label={
                                                    expandedOrder === id
                                                        ? 'Collapse'
                                                        : 'Expand'
                                                }
                                            >
                                                {expandedOrder === id ? (
                                                    <ChevronUp className='w-4 h-4' />
                                                ) : (
                                                    <ChevronDown className='w-4 h-4' />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        <div className='text-sm text-gray-700'>
                                            <div className='flex items-center gap-2'>
                                                <Calendar className='w-4 h-4 text-gray-500' />
                                                <span>
                                                    Booked:{' '}
                                                    {bookingOn || createdOn}
                                                </span>
                                            </div>
                                            <div className='mt-1'>
                                                <span className='font-medium'>
                                                    Service:
                                                </span>{' '}
                                                <span className='text-gray-600'>
                                                    {serviceName}
                                                </span>
                                            </div>
                                            <div className='mt-1'>
                                                <span className='font-medium'>
                                                    Cycle:
                                                </span>{' '}
                                                <span className='text-gray-600'>
                                                    {[cycleName, cycleType]
                                                        .filter(Boolean)
                                                        .join(' • ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='text-sm text-gray-700'>
                                            <div>
                                                <span className='font-medium'>
                                                    Scheduled:
                                                </span>{' '}
                                                <span className='text-gray-600'>
                                                    {serviceOn ||
                                                        'Not Scheduled Yet'}
                                                </span>
                                            </div>
                                            <div className='mt-1'>
                                                <span className='font-medium'>
                                                    Total:
                                                </span>{' '}
                                                <span className='text-gray-600'>
                                                    {total
                                                        ? `₹${total}`
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                            <div className='mt-1'>
                                                <span className='font-medium'>
                                                    Receipt:
                                                </span>{' '}
                                                <span className='text-gray-600'>
                                                    {receiptId || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable details */}
                                    <AnimatePresence>
                                        {expandedOrder === id && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className='mt-4 pt-4 border-t border-gray-200 space-y-4'
                                            >
                                                {/* Customer and technician */}
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Address
                                                        </span>
                                                        <div className='mt-1 flex items-start gap-2 text-gray-600'>
                                                            <MapPin className='w-4 h-4 mt-0.5' />
                                                            <span>
                                                                {address || '-'}
                                                            </span>
                                                        </div>
                                                        <div className='mt-1 flex items-center gap-2 text-gray-600'>
                                                            <Phone className='w-4 h-4' />
                                                            <span>
                                                                {userPhone ||
                                                                    '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Technician
                                                        </span>
                                                        <div className='mt-1 text-gray-600'>
                                                            {[
                                                                techFirst,
                                                                techLast,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(' ') ||
                                                                'Not Assigned'}
                                                        </div>
                                                        {techPhone && (
                                                            <div className='text-gray-600'>
                                                                {techPhone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Activity timeline */}
                                                {Array.isArray(
                                                    order?.activity
                                                ) &&
                                                    order.activity.length >
                                                        0 && (
                                                        <div>
                                                            <span className='font-medium text-gray-700'>
                                                                Activity
                                                            </span>
                                                            <div className='mt-2 space-y-2'>
                                                                {[
                                                                    ...order.activity,
                                                                ]
                                                                    .sort(
                                                                        (
                                                                            a: any,
                                                                            b: any
                                                                        ) =>
                                                                            new Date(
                                                                                a.createdAt
                                                                            ).getTime() -
                                                                            new Date(
                                                                                b.createdAt
                                                                            ).getTime()
                                                                    )
                                                                    .map(
                                                                        (
                                                                            ev: any,
                                                                            idx: number
                                                                        ) => {
                                                                            const label =
                                                                                ACTIVITY_TO_STATUS[
                                                                                    String(
                                                                                        ev?.state ||
                                                                                            ''
                                                                                    ).toUpperCase()
                                                                                ] ||
                                                                                ev?.state ||
                                                                                '-';
                                                                            return (
                                                                                <div
                                                                                    key={`${ev.state}-${idx}`}
                                                                                    className='flex items-center justify-between text-sm'
                                                                                >
                                                                                    <div className='text-gray-700'>
                                                                                        {
                                                                                            label
                                                                                        }
                                                                                        {ev
                                                                                            ?.createdBy
                                                                                            ?.firstName
                                                                                            ? ` • ${
                                                                                                  ev
                                                                                                      .createdBy
                                                                                                      .firstName
                                                                                              } ${
                                                                                                  ev
                                                                                                      .createdBy
                                                                                                      .lastName ??
                                                                                                  ''
                                                                                              }`.trim()
                                                                                            : ''}
                                                                                    </div>
                                                                                    <div className='text-gray-500'>
                                                                                        {formatDateTime(
                                                                                            ev?.createdAt
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Order meta */}
                                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Order ID
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            {receiptId}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Last Updated
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            {updatedOn || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {!isLoading && orders.length === 0 && (
                <div className='text-center py-12'>
                    <p className='text-gray-400'>No orders found</p>
                </div>
            )}
        </motion.div>
    );

    const renderSettingsTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-6'
        >
            <Card className='bg-white rounded-none'>
                <CardContent className='p-6'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                        Settings
                    </h3>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between py-3 border-b border-gray-200'>
                            <span className='text-gray-700'>Notifications</span>
                            <Button variant='outline' size='sm'>
                                Configure
                            </Button>
                        </div>
                        <div className='flex items-center justify-between py-3 border-b border-gray-200'>
                            <span className='text-gray-700'>Privacy</span>
                            <Button variant='outline' size='sm'>
                                Manage
                            </Button>
                        </div>
                        <div className='flex items-center justify-between py-3 border-b border-gray-200'>
                            <span className='text-gray-700'>
                                Account Security
                            </span>
                            <Button variant='outline' size='sm'>
                                Update
                            </Button>
                        </div>
                        <div className='flex items-center justify-between py-3'>
                            <span className='text-red-600'>Delete Account</span>
                            <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-300 bg-transparent'
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className='min-h-screen bg-[#3c3d3f] text-white'>
            <Header />

            <div className='container mx-auto px-4 py-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-[#fbbf24]'>
                        My Account
                    </h1>
                </div>

                {/* Tab Navigation */}
                <div className='flex justify-center mb-8'>
                    <div className='flex bg-[#3c3d3f] p-1 border-[#4a4b4d] border-b-2'>
                        {[
                            { key: 'profile', label: 'Profile' },
                            { key: 'orders', label: 'My Orders' },
                            { key: 'settings', label: 'Settings' },
                        ].map((tab) => (
                            <Button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                                    activeTab === tab.key
                                        ? 'bg-[#fbbf24] text-black'
                                        : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
                                }`}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className='max-w-4xl mx-auto'>
                    <AnimatePresence mode='wait'>
                        {activeTab === 'profile' && renderProfileTab()}
                        {activeTab === 'orders' && renderMyOrdersTab()}
                        {activeTab === 'settings' && renderSettingsTab()}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function AccountPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <Account />
        </Suspense>
    );
}

function LoadingState() {
    return (
        <div className='p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </div>
    );
}
