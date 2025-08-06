'use client'

import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  return (
    <section className="relative min-h-screen bg-[#060608] overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060608] via-[#3c3d3f] to-[#060608] opacity-90"></div>
      
      {/* Background bicycle image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/placeholder.svg?height=800&width=1200&text=Bicycle+Background"
          alt="Background bicycle"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Pedal with <span className="text-[#fbbf24]">Peace of</span><br />
              mind
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Our expert technicians service your companion at home. Professional bike servicing at your convenience, wherever you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-[#fbbf24] text-sm">Welcome back, {user?.name}!</p>
                  <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 text-lg">
                    Book Service Now
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 text-lg">
                    Book Service
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="border-gray-600 text-white hover:bg-[#3c3d3f] px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600&text=Professional+Bicycle+Service"
              alt="Bicycle maintenance service"
              width={600}
              height={500}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
