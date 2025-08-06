'use client'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RootState } from '@/lib/store'
import {
  setPhoneNumber,
  setOtp,
  setLoginStep,
  setLoading,
  setError,
  loginSuccess,
  resetAuth,
} from '@/lib/slices/authSlice'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loginStep, phoneNumber, otp, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )

  const [otpInputs, setOtpInputs] = useState(['', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    dispatch(resetAuth())
    setOtpInputs(['', '', '', ''])
  }, [dispatch])

  const handleGetOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      dispatch(setError('Please enter a valid phone number'))
      return
    }

    dispatch(setLoading(true))
    
    // Simulate API call
    setTimeout(() => {
      dispatch(setLoading(false))
      dispatch(setLoginStep('otp'))
    }, 1000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpInputs = [...otpInputs]
      newOtpInputs[index] = value
      setOtpInputs(newOtpInputs)
      
      const otpString = newOtpInputs.join('')
      dispatch(setOtp(otpString))

      // Auto-focus next input
      if (value && index < 3) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmitOTP = async () => {
    if (otp.length !== 4) {
      dispatch(setError('Please enter complete OTP'))
      return
    }

    dispatch(setLoading(true))

    // Simulate API call with dummy data
    setTimeout(() => {
      if (otp === '1234') {
        dispatch(loginSuccess({
          id: '1',
          phone: phoneNumber,
          name: 'John Doe'
        }))
        router.push('/')
      } else {
        dispatch(setError('Invalid OTP. Use 1234 for demo'))
      }
      dispatch(setLoading(false))
    }, 1000)
  }

  const handleResendOTP = () => {
    dispatch(setLoading(true))
    setOtpInputs(['', '', '', ''])
    dispatch(setOtp(''))
    
    setTimeout(() => {
      dispatch(setLoading(false))
      dispatch(setError(''))
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#060608] flex">
      {/* Left side - Bicycle image and branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#060608] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060608] via-[#3c3d3f] to-[#060608] opacity-90"></div>
        
        {/* Background bicycle image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/placeholder.svg?height=800&width=600&text=Professional+Bicycle+Service"
            alt="Background bicycle"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 p-12 flex flex-col justify-center">
          <Link href="/" className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-[#060608] rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-white">BikeService</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Pedal with Peace of mind
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our expert technicians service your companion at home. Professional bike servicing at your convenience, wherever you are.
            </p>
          </div>

          {/* Decorative bicycle illustration */}
          <div className="absolute bottom-12 right-12 opacity-30">
            <svg width="200" height="150" viewBox="0 0 200 150" className="text-[#fbbf24]">
              <circle cx="50" cy="120" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="150" cy="120" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M25 120 L75 120 L100 80 L125 120 L175 120" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M100 80 L100 100" stroke="currentColor" strokeWidth="2"/>
              <path d="M90 100 L110 100" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 bg-[#3c3d3f] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile header */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-[#fbbf24] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-[#060608] rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-white">BikeService</span>
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2">
              Pedal with Peace of mind
            </h2>
            <p className="text-gray-300 text-sm">
              Our expert technicians service your companion at home
            </p>
          </div>

          <div className="space-y-6">
            {loginStep === 'phone' && (
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-white mb-2">Welcome back</h3>
                  <p className="text-gray-300 text-sm">
                    Add your phone number to login
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                    className="h-12 bg-[#2a2b2d] border-[#4a4b4d] text-white placeholder:text-gray-500 focus:border-[#fbbf24] focus:ring-[#fbbf24] text-lg"
                    maxLength={10}
                  />
                  
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <Button
                    onClick={handleGetOTP}
                    disabled={isLoading}
                    className="w-full h-12 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold text-lg"
                  >
                    {isLoading ? 'Sending...' : 'Get OTP'}
                  </Button>
                </div>
              </div>
            )}

            {loginStep === 'otp' && (
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-white mb-2">Verify your number</h3>
                  <p className="text-gray-300 text-sm">
                    Type the verification code sent to {phoneNumber}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-3 justify-center">
                    {otpInputs.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-14 text-center bg-[#2a2b2d] border-[#4a4b4d] text-white text-xl font-semibold focus:border-[#fbbf24] focus:ring-[#fbbf24]"
                        maxLength={1}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">
                      Didn't receive code?
                    </span>
                    <button
                      onClick={handleResendOTP}
                      className="text-[#fbbf24] hover:underline font-medium"
                      disabled={isLoading}
                    >
                      Resend
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  <Button
                    onClick={handleSubmitOTP}
                    disabled={isLoading}
                    className="w-full h-12 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold text-lg"
                  >
                    {isLoading ? 'Verifying...' : 'Submit'}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    Demo: Use OTP "1234" to login
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
