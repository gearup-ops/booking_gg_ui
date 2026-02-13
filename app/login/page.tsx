'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { RootState, AppDispatch } from '@/lib/store';
import {
    getUserByIdAction,
    registerUserAction,
    sendOtpAction,
    verifyOtpAction,
} from '@/lib/actions/userActions';
import {
    setphone,
    setOtp,
    resetAuth,
    clearError,
} from '@/lib/slices/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import { firebaseAuth } from '@/lib/firebaseClient';
import { signInWithPhoneNumber } from 'firebase/auth';
import { getLocaleStorage, setLocaleStorage } from '@/lib/utils';
import { setupRecaptcha } from '@/lib/setupRecapcha';
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loginStep, phone, otp, isLoading, error, isAuthenticated } =
        useSelector((state: RootState) => state.auth);
    const [otpInputs, setOtpInputs] = useState<string>('');
    const [confirmation, setConfirmation] = useState<any>(null);

    useEffect(() => {
        if (isAuthenticated || getLocaleStorage('token')) {
            router.push('/');
            dispatch(getUserByIdAction());
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        dispatch(resetAuth());
        setOtpInputs('');
    }, [dispatch]);

    useEffect(() => {
        dispatch(setOtp(otpInputs));
    }, [otpInputs, dispatch]);

    const handleGetOTP = async () => {
        if (!phone || phone.length < 10) {
            // Error message will be handled by the slice if API returns an error
            return;
        }
        const verifier = await setupRecaptcha();
        // setupRecaptcha(); // setup invisible recaptcha
        try {
            let confirmationResult;
            if (typeof window !== 'undefined') {
                confirmationResult = await signInWithPhoneNumber(
                    firebaseAuth,
                    `+91${phone}`,
                    verifier
                );
            }
            setConfirmation(confirmationResult);
            console.log(confirmationResult);

            alert('OTP sent!');
            dispatch(sendOtpAction({ confirmationResult, phone }));
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleOtpChange = (value: string) => {
        setOtpInputs(value);
    };

    const handleSubmitOTP = async () => {
        if (!confirmation) return alert('No confirmation available');
        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            // Error message will be handled by the slice if API returns an error
            return;
        }
        try {
            const result = await confirmation.confirm(otp);
            const user = result.user;
            const token = await user.getIdToken();

            // Immediately call your backend API
            const res = await dispatch(
                registerUserAction({
                    phone: user.phoneNumber.slice(3) || '',
                    fcm: '',
                })
            ).unwrap();

            if (res?.token) {
                setLocaleStorage('token', res.token);
                router.push('/');
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleResendOTP = () => {
        setOtpInputs('');
        dispatch(setOtp(''));
        dispatch(clearError()); // Clear any previous OTP error
        dispatch(sendOtpAction({ phone }));
    };

    return (
        <div className='min-h-screen h-screen bg-[#3c3d3f] flex flex-col lg:flex-row'>
            {/* Left side - Bicycle image and branding */}
            <div className='relative w-full lg:w-2/3 h-[50vh] lg:h-auto flex items-center justify-center overflow-hidden'>
                {/* Background bicycle image */}
                <div className='absolute inset-0'>
                    <Image
                        src='/images/bg-cycle.jpg'
                        alt='Background bicycle'
                        fill
                        className='object-cover object-center'
                    />
                </div>
                {/* <div className='absolute inset-0 bg-gradient-to-br from-[#060608] via-[#3c3d3f] to-[#060608] opacity-70'></div> */}

                <div className='relative z-10 flex flex-col justify-center items-center w-full h-full p-4 md:p-12'>
                    {/* Logo for desktop view */}
                    <Link
                        href='/'
                        className='flex items-center space-x-2 absolute top-8 left-8 lg:top-12 lg:left-12'
                    >
                        <Image
                            src='/images/logo.png'
                            alt='GearGrow Cycle Logo'
                            width={32}
                            height={32}
                            className='w-16 h-16'
                        />
                    </Link>

                    <div className='space-y-2 p-4 md:p-8 lg:pb-16 bg-black opacity-50 rounded-2xl max-w-xl lg:max-w-4xl'>
                        <h1 className='text-4xl md:text-6xl font-bold text-white leading-tight'>
                            Pedal with Peace of mind
                        </h1>
                        <p className='text-xl md:text-3xl lg:max-w-2xl text-gray-300 font-semibold'>
                            Our expert technicians service your companion at
                            home.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className='w-full lg:w-1/3 bg-[#3c3d3f] flex items-center justify-center p-8 py-16 lg:py-8 h-[50vh] lg:h-auto'>
                <div className='w-full max-w-md space-y-8'>
                    <div className='space-y-6'>
                        {loginStep === 'phone' && (
                            <div className='space-y-6'>
                                <div className='text-left'>
                                    <h3 className='text-xl font-semibold text-white'>
                                        Add your phone number to login
                                    </h3>
                                </div>

                                <div className='space-y-4 text-center'>
                                    <div id='recaptcha-container'></div>
                                    <Input
                                        type='tel'
                                        placeholder='Phone Number'
                                        value={phone}
                                        onChange={(e) =>
                                            dispatch(setphone(e.target.value))
                                        }
                                        className='h-12 bg-[#fff] border-[#4a4b4d] text-black placeholder:text-gray-600 focus:border-[#fbbf24] focus:ring-[#fbbf24] text-lg'
                                        maxLength={10}
                                    />

                                    {error && (
                                        <p className='text-red-400 text-sm'>
                                            {error}
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleGetOTP}
                                        disabled={
                                            isLoading ||
                                            !phone ||
                                            phone.length < 10
                                        }
                                        className='h-12 bg-[#F5B41D] hover:bg-[#F5B41D] text-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? 'Sending...' : 'Get OTP'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {loginStep === 'otp' && (
                            <div className='space-y-6'>
                                {/* <div className='text-center lg:text-left'>
                                </div> */}

                                <div className='space-y-6 text-center'>
                                    <p className='text-gray-300 text-sm text-left ml-8 lg:ml-0'>
                                        Type the verification code sent to{' '}
                                        {phone}
                                    </p>
                                    <div className='flex gap-6 justify-center'>
                                        <InputOTP
                                            maxLength={6}
                                            defaultValue={otpInputs}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            onChange={(e) => handleOtpChange(e)}
                                            value={otpInputs}
                                        >
                                            <InputOTPGroup className='text-center gap-3 text-black text-xl font-bold'>
                                                <InputOTPSlot
                                                    index={0}
                                                    className='border-none rounded-md bg-white w-12 h-12'
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className='border-none rounded-md bg-white w-12 h-12'
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className='border-none rounded-md bg-white w-12 h-12'
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className='border-none rounded-md bg-white w-12 h-12'
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className='border-none rounded-md bg-white w-12 h-12'
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className='border-none rounded-md bg-white w-12 h-12'
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    <div className='flex space-x-2 items-center text-sm ml-8 lg:ml-0'>
                                        <span className='text-gray-300'>
                                            Didn't receive code?
                                        </span>
                                        <button
                                            onClick={handleResendOTP}
                                            className='text-[#fbbf24] hover:underline font-medium'
                                            disabled={isLoading}
                                        >
                                            Resend
                                        </button>
                                    </div>

                                    {error && (
                                        <p className='text-red-400 text-sm text-center'>
                                            {error}
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleSubmitOTP}
                                        disabled={isLoading || otp.length !== 6}
                                        className='h-12 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? 'Verifying...' : 'Submit'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <div className='text-center'>
                        <Link
                            href='/'
                            className='text-gray-400 hover:text-white text-sm'
                        >
                            ← Back to home
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
