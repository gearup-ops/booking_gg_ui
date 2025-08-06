'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { RootState } from '@/lib/store'

const serviceDetails = {
  'standard': {
    title: 'Standard service',
    description: 'Our most popular plan for non-gear & kids bicycle',
    price: 499,
    features: [
      { name: 'Stem Bolt (Alignment of the headset)', included: true },
      { name: 'Brakes (Check & Adjust)', included: true },
      { name: 'Pedals (Tightening)', included: true },
      { name: 'Axle setting (Loose & Tightening)', included: true },
      { name: 'Tyre pressure (Check to inflate to correct pressure)', included: true },
      { name: 'Gear tune-up', included: true },
      { name: 'Brake levers (Loose and Tightening cable)', included: true },
      { name: 'Bottom bracket (Checkup)', included: false },
      { name: 'Chain (Check & Lube)', included: false },
      { name: 'Cables (Check & Lube)', included: false },
      { name: 'Checking & tightening all screw & bolts', included: false },
      { name: 'Wheel truing (Not wheel bend)', included: false },
      { name: 'Pre-Ride check', included: false },
      { name: 'Safety checks', included: false },
      { name: 'Hub Checkup', included: false },
      { name: 'Clean (Cleaning the bike)', included: false },
    ],
  },
  'premium': {
    title: 'Premium service',
    description: 'Our advanced plan for comprehensive maintenance.',
    price: 799,
    features: [
      { name: 'Stem Bolt (Alignment of the headset)', included: true },
      { name: 'Brakes (Check & Adjust)', included: true },
      { name: 'Pedals (Tightening)', included: true },
      { name: 'Axle setting (Loose & Tightening)', included: true },
      { name: 'Tyre pressure (Check to inflate to correct pressure)', included: true },
      { name: 'Gear tune-up', included: true },
      { name: 'Brake levers (Loose and Tightening cable)', included: true },
      { name: 'Bottom bracket (Checkup)', included: true },
      { name: 'Chain (Check & Lube)', included: true },
      { name: 'Cables (Check & Lube)', included: true },
      { name: 'Checking & tightening all screw & bolts', included: true },
      { name: 'Wheel truing (Not wheel bend)', included: true },
      { name: 'Pre-Ride check', included: true },
      { name: 'Safety checks', included: true },
      { name: 'Hub Checkup', included: true },
      { name: 'Clean (Cleaning the bike)', included: true },
    ],
  },
  'assemble-dismantle': {
    title: 'Assemble - Dismantle',
    description: 'Professional assembly and disassembly services for your bicycle.',
    price: 399,
    features: [
      { name: 'Full assembly from box', included: true },
      { name: 'Disassembly for transport', included: true },
      { name: 'Basic safety check', included: true },
    ],
  },
  'annual-maintenance': {
    title: 'Annual Maintenance',
    description: 'Comprehensive yearly maintenance package to keep your bike in perfect condition.',
    price: 1299,
    features: [
      { name: 'Quarterly service (4 times/year)', included: true },
      { name: 'Priority booking', included: true },
      { name: 'Free minor repairs', included: true },
    ],
  },
  'road-bike-service': {
    title: 'Road Bike service',
    description: 'Specialized service for road bikes, focusing on performance and precision.',
    price: 599,
    features: [
      { name: 'Road bike specific tune-up', included: true },
      { name: 'Aerodynamic adjustments', included: true },
      { name: 'Tire pressure optimization', included: true },
    ],
  },
  'e-bike-service': {
    title: 'E - Bike service',
    description: 'Expert maintenance for electric bicycles, including battery and motor checks.',
    price: 699,
    features: [
      { name: 'Motor and battery diagnostics', included: true },
      { name: 'Electrical system check', included: true },
      { name: 'Software updates (if applicable)', included: true },
    ],
  },
}

export default function ServicesSection() {
  const [selectedServiceKey, setSelectedServiceKey] = useState('standard')
  const [isGearBike, setIsGearBike] = useState(true) // true for Gear, false for Non-Gear
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const currentService = serviceDetails[selectedServiceKey as keyof typeof serviceDetails]

  const handleBookNow = () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
    } else {
      alert(`Booking ${currentService.title} for ${isGearBike ? 'Gear' : 'Non-Gear'} bike. Price: ${currentService.price} Rs`)
      // Further booking logic here
    }
  }

  return (
    <section className="py-16 bg-[#060608]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our services</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Skip the hassle: our on demand bicycle servicing comes to you!
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-[#3c3d3f] rounded-full p-1 flex items-center space-x-2 border border-[#4a4b4d]">
            <Button
              onClick={() => setIsGearBike(true)}
              className={`px-6 py-2 rounded-full transition-colors ${
                isGearBike ? 'bg-[#fbbf24] text-black' : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
              }`}
            >
              Gear
            </Button>
            <Button
              onClick={() => setIsGearBike(false)}
              className={`px-6 py-2 rounded-full transition-colors ${
                !isGearBike ? 'bg-[#fbbf24] text-black' : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
              }`}
            >
              Non-Gear
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Service List */}
          <div className="space-y-4">
            {Object.keys(serviceDetails).map((key) => {
              const service = serviceDetails[key as keyof typeof serviceDetails]
              return (
                <button
                  key={key}
                  onClick={() => setSelectedServiceKey(key)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex justify-between items-center ${
                    selectedServiceKey === key
                      ? 'bg-[#fbbf24] text-black border-[#fbbf24]'
                      : 'bg-[#3c3d3f] text-white border-[#4a4b4d] hover:bg-[#2a2b2d]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {selectedServiceKey === key && (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    <div>
                      <span className="font-semibold text-lg">{service.title}</span>
                      <span className="block text-sm text-gray-600">
                        {isGearBike ? 'Gear' : 'Non-Gear'}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{service.price} Rs</span>
                </button>
              )
            })}
          </div>

          {/* Right Panel: Service Details */}
          <div className="bg-[#3c3d3f] rounded-lg p-6 border border-[#4a4b4d] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{currentService.title}</h3>
                <p className="text-gray-400 text-sm">{currentService.description}</p>
              </div>
              <div className="text-4xl font-bold text-[#4CAF50] bg-[#4CAF50] bg-opacity-20 px-4 py-2 rounded-lg">
                {currentService.price} Rs
              </div>
            </div>

            <h4 className="text-lg font-semibold text-white mb-3">What we provide?</h4>
            <ul className="space-y-2 text-gray-300">
              {currentService.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {feature.included ? (
                    <CheckCircle2 className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={handleBookNow}
            className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-12 py-4 text-xl rounded-lg"
          >
            Book Now
          </Button>
        </div>
      </div>
    </section>
  )
}
