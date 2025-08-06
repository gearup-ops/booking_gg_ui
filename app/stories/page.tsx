'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link' // Add this import

const testimonials = [
  {
    name: 'John Smith',
    text: 'Excellent service and done... Great work and very helpful technicians. They came to my home and fixed my bike perfectly. The service was quick and professional. I would definitely recommend this service to everyone.',
    image: '/placeholder.svg?height=80&width=80&text=JS'
  },
  {
    name: 'Sarah Johnson',
    text: 'Amazing doorstep service! The technician was very professional and fixed all the issues with my bike. Great value for money and very convenient.',
    image: '/placeholder.svg?height=80&width=80&text=SJ'
  },
  {
    name: 'Michael Brown',
    text: 'My bike feels brand new after the annual maintenance. The team was thorough and very knowledgeable. Highly impressed with the quality of work and the convenience of service at home.',
    image: '/placeholder.svg?height=80&width=80&text=MB'
  },
  {
    name: 'Emily Davis',
    text: 'Had a flat tire during my morning ride, and BikeService came to the rescue quickly! Professional, friendly, and got me back on the road in no time. Lifesavers!',
    image: '/placeholder.svg?height=80&width=80&text=ED'
  }
]

export default function StoriesPage() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000) // Change testimonial every 7 seconds

    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white">
      <Header />

      {/* Hero Section for Stories */}
      <section className="py-16 bg-[#060608]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#fbbf24] mb-4">
            Our Happy Riders
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear directly from our satisfied customers about their experience with Doorstep Bicycle Maintenance.
          </p>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-[#3c3d3f]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#fbbf24]">
            What Our Customers Say
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[#060608] rounded-lg p-8 relative border border-[#4a4b4d]">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                <Image
                  src={testimonials[currentTestimonialIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentTestimonialIndex].name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    {testimonials[currentTestimonialIndex].text}
                  </p>
                  <p className="font-semibold text-[#fbbf24]">
                    - {testimonials[currentTestimonialIndex].name}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTestimonial}
                  className="text-[#fbbf24] hover:bg-[#3c3d3f]"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonialIndex ? 'bg-[#fbbf24]' : 'bg-gray-600'
                      }`}
                      onClick={() => setCurrentTestimonialIndex(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTestimonial}
                  className="text-[#fbbf24] hover:bg-[#3c3d3f]"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Stories/Call to Action (Optional) */}
      <section className="py-16 bg-[#060608]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to become a happy rider?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of satisfied customers who trust us with their bicycle maintenance.
          </p>
          <Link href="/services">
            <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 text-lg">
              Book Your Service Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
