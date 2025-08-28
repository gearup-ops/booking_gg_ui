'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RootState, AppDispatch } from '@/lib/store';
import { getOrdersByUserIdAction } from '@/lib/actions/orderActions';
import { updateCustomerAction } from '@/lib/actions/userActions';
import {
    ChevronDown,
    ChevronUp,
    Edit2,
    Calendar,
    MapPin,
    Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );
    const { orders, isLoading } = useSelector(
        (state: RootState) => state.order
    );

    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [editedProfile, setEditedProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jondoe@gmail.com',
        address1: '123 Main St',
        address2: 'Phase 1',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        pinCode: '411057',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            // Fetch user orders
            // dispatch(getOrdersByUserIdAction(user.id));

            // Initialize profile form
            setEditedProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                address1: user.address1 || '',
                address2: user.address2 || '',
                city: user.city || '',
                state: user.state || '',
                country: user.country || '',
                pinCode: user.pinCode || '',
            });
        }
    }, [isAuthenticated, user, router, dispatch]);

    const handleSaveProfile = async () => {
        if (user) {
            await dispatch(
                updateCustomerAction({ userId: user.id, data: editedProfile })
            );
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        if (user) {
            setEditedProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                address1: user.address1 || '',
                address2: user.address2 || '',
                city: user.city || '',
                state: user.state || '',
                country: user.country || '',
                pinCode: user.pinCode || '',
            });
        }
        setIsEditing(false);
    };

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'confirmed':
                return 'bg-blue-500';
            case 'in-progress':
                return 'bg-orange-500';
            case 'completed':
                return 'bg-green-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getOrderStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Booking Initiated';
            case 'confirmed':
                return 'Booking Accepted';
            case 'in-progress':
                return 'Technician assigned';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const renderOrderProgress = (status: string) => {
        const steps = ['pending', 'confirmed', 'in-progress', 'completed'];
        const currentStepIndex = steps.indexOf(status);

        return (
            <div className='flex items-center justify-between mb-6 px-4'>
                {steps.map((step, index) => (
                    <div key={step} className='flex items-center'>
                        <div
                            className={`w-4 h-4 rounded-full ${
                                index <= currentStepIndex
                                    ? 'bg-[#fbbf24]'
                                    : 'bg-gray-600'
                            }`}
                        />
                        {index < steps.length - 1 && (
                            <div
                                className={`w-16 h-0.5 mx-2 ${
                                    index < currentStepIndex
                                        ? 'bg-[#fbbf24]'
                                        : 'bg-gray-600'
                                }`}
                            />
                        )}
                    </div>
                ))}
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
                                onClick={() => setIsEditing(true)}
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
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        firstName: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>Last Name</Label>
                            <Input
                                value={editedProfile.lastName}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        lastName: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <Label className='text-gray-700'>Email</Label>
                            <Input
                                type='email'
                                value={editedProfile.email}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        email: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <Label className='text-gray-700'>
                                Address line 1
                            </Label>
                            <Input
                                value={editedProfile.address1}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        address1: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
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
                            <Input
                                value={editedProfile.city}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        city: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-gray-700'>State</Label>
                            <Input
                                value={editedProfile.state}
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
                                value={editedProfile.country}
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
                                value={editedProfile.pinCode}
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        pinCode: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                className='bg-gray-50 border-gray-200 text-black'
                            />
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
            {orders.length > 0 && renderOrderProgress(orders[0].status)}

            <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-white'>My Orders</h3>
                <Button
                    variant='ghost'
                    className='text-[#fbbf24] hover:text-[#f59e0b]'
                >
                    See All
                </Button>
            </div>

            <div className='space-y-4'>
                {orders.map((order) => (
                    <div>
                        <Badge
                            className={`${getOrderStatusColor(
                                order.status
                            )} text-white rounded-none`}
                        >
                            {getOrderStatusText(order.status)}
                        </Badge>
                        <Card key={order.id} className='bg-white rounded-none'>
                            <CardContent className='px-4'>
                                <div className='flex items-center justify-between mb-3'>
                                    <span className='text-sm text-gray-500'>
                                        Technician will be assigned shortly
                                    </span>
                                </div>

                                <div className='space-y-2'>
                                    <p className='text-sm text-gray-600'>
                                        Your cycle: Hero- model/36
                                    </p>
                                    <h4 className='font-semibold text-gray-900'>
                                        {order.serviceName}
                                    </h4>

                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center space-x-2 text-sm text-gray-600'>
                                            <Calendar className='w-4 h-4' />
                                            <span>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className='flex space-x-2'>
                                            {order.status !== 'completed' &&
                                                order.status !==
                                                    'cancelled' && (
                                                    <>
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                            className='text-white bg-red-600'
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                            className='text-gray-600 border-gray-300 bg-transparent'
                                                        >
                                                            Reschedule
                                                        </Button>
                                                    </>
                                                )}
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() =>
                                                    setExpandedOrder(
                                                        expandedOrder ===
                                                            order.id
                                                            ? null
                                                            : order.id
                                                    )
                                                }
                                                className='text-gray-600'
                                            >
                                                {expandedOrder === order.id ? (
                                                    <ChevronUp className='w-4 h-4' />
                                                ) : (
                                                    <ChevronDown className='w-4 h-4' />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
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
                                                className='mt-4 pt-4 border-t border-gray-200 space-y-3'
                                            >
                                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Order ID:
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            {order.id}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Total Amount:
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            ₹{order.totalAmount}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Service Type:
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            {order.serviceName}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Status:
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            {getOrderStatusText(
                                                                order.status
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className='font-medium text-gray-700'>
                                                        Customer Details:
                                                    </span>
                                                    <div className='mt-2 space-y-1 text-sm text-gray-600'>
                                                        <div className='flex items-center space-x-2'>
                                                            <MapPin className='w-4 h-4' />
                                                            <span>
                                                                {
                                                                    order
                                                                        .customerDetails
                                                                        .address1
                                                                }
                                                                ,{' '}
                                                                {
                                                                    order
                                                                        .customerDetails
                                                                        .city
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className='flex items-center space-x-2'>
                                                            <Phone className='w-4 h-4' />
                                                            <span>
                                                                {
                                                                    order
                                                                        .customerDetails
                                                                        .phone
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {order.technicianName && (
                                                    <div>
                                                        <span className='font-medium text-gray-700'>
                                                            Technician:
                                                        </span>
                                                        <p className='text-gray-600'>
                                                            {
                                                                order.technicianName
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {orders.length === 0 && (
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
