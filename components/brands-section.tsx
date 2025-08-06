export default function BrandsSection() {
  const brands = [
    'HERO', 'FIREFOX', 'SCHWINN', 'GIANT', 'TREK'
  ]

  return (
    <section className="py-16 bg-[#3c3d3f]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#fbbf24]">
          Brands we served for
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {brands.map((brand, index) => (
            <div key={index} className="text-xl font-bold text-gray-300">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
