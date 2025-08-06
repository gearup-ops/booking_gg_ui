export default function StatsSection() {
  const stats = [
    { number: '100+', label: 'Bicycles serviced in 2023' },
    { number: '70+', label: 'Expert Technicians on Staff' },
    { number: '25+', label: 'Happy customers' }
  ]

  return (
    <section className="py-16 bg-[#060608]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-300">
            We have Provided accessible and hassle-free, Convenient and reliable Doorstep bicycle maintenance Services for 5+ years
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="border-2 border-[#fbbf24] rounded-lg p-6 inline-block bg-[#3c3d3f]">
                <div className="text-4xl font-bold text-[#fbbf24] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
