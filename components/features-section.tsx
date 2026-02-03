import { MapPin, Clock, Star } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Schedule online',
      description: 'Book your service appointment online with just a few clicks'
    },
    {
      icon: Clock,
      title: 'Maintenance at your place',
      description: 'Our experts come to your location for convenient service'
    },
    {
      icon: Star,
      title: 'Enjoy riding',
      description: 'Get back to riding with a perfectly maintained bicycle'
    }
  ]

  return (
    <section className="py-16 bg-[#3c3d3f]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center mx-auto">
                <feature.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
