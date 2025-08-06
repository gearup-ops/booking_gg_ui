import { Wrench, Shield, Clock, Award } from 'lucide-react'

export default function ServiceHighlights() {
  const highlights = [
    {
      icon: Wrench,
      title: 'Expert Technicians',
      description: 'Certified professionals with years of experience'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'All services come with our quality assurance'
    },
    {
      icon: Clock,
      title: 'Quick Service',
      description: 'Fast and efficient maintenance at your doorstep'
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing with transparent costs'
    }
  ]

  return (
    <section className="py-16 bg-[#060608]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center mx-auto">
                <highlight.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-white">{highlight.title}</h3>
              <p className="text-gray-300 text-sm">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
