import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-[#3c3d3f]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#fbbf24]">
              Why choose us?
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We provide professional bicycle maintenance services with over 5 years of experience in the industry. Our certified technicians ensure your bike receives the best care possible.
              </p>
              <p>
                With our doorstep service, you don't have to worry about transportation or waiting in long queues. We come to you with all the necessary tools and equipment.
              </p>
              <p>
                Our transparent pricing and quality guarantee ensure you get the best value for your money. We use only genuine parts and provide warranty on all our services.
              </p>
            </div>
            <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold">
              Learn More
            </Button>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=500&text=Professional+Bicycle+Maintenance"
              alt="Professional bicycle maintenance"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
