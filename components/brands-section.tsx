export default function BrandsSection() {
    const brands = ['HERO', 'FIREFOX', 'SCHNELL', 'GIANT', 'TREK'];

    return (
        <section className='py-16 bg-[#3c3d3f]'>
            <div className='container mx-auto px-4'>
                <h2 className='text-2xl font-bold text-center mb-8 text-[#fbbf24]'>
                    Brands we served for
                </h2>
                <div className='relative w-full overflow-hidden'>
                    <div
                        className='flex'
                        style={{
                            animation: 'scrollBrands 12s linear infinite',
                            width: `${brands.length * 200}px`,
                        }}
                    >
                        {[...brands, ...brands].map((brand, index) => (
                            <div
                                key={index}
                                className='flex-shrink-0 w-1/3 max-w-xs flex justify-center items-center mx-4'
                            >
                                <img
                                    src={`/images/brands/${brand.toLowerCase()}.svg`}
                                    alt={brand}
                                    className='h-20 object-contain opacity-80'
                                />
                            </div>
                        ))}
                    </div>
                    <style jsx>{`
                        @keyframes scrollBrands {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(
                                    -${(brands.length * 200) / 2}px
                                );
                            }
                        }
                    `}</style>
                </div>
            </div>
        </section>
    );
}
