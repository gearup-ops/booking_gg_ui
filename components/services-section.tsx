// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Button } from '@/components/ui/button';
// import { CheckCircle2, XCircle } from 'lucide-react';
// import Image from 'next/image';
// import { RootState, AppDispatch } from '@/lib/store';
// import { getServicesAction } from '@/lib/actions/serviceActions';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';

// export default function ServicesSection() {
//     const router = useRouter();
//     const dispatch = useDispatch<AppDispatch>();
//     const [selectedServiceKey, setSelectedServiceKey] = useState('');
//     console.log(selectedServiceKey);

//     const [isGearBike, setIsGearBike] = useState(true);
//     const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//     const { services, isLoading } = useSelector(
//         (state: RootState) => state.services
//     );

//     // Fetch services on component mount
//     useEffect(() => {
//         dispatch(getServicesAction());
//     }, [dispatch]);

//     const currentService =
//         serviceDetails[selectedServiceKey as keyof typeof serviceDetails];

//     const handleBookNow = () => {
//         if (!isAuthenticated) {
//             router.push('/login');
//             return;
//         }

//         // Navigate to booking page with service details
//         const params = new URLSearchParams({
//             service: selectedServiceKey,
//             name: currentService.title,
//             type: isGearBike ? 'gear' : 'non-gear',
//             price: currentService.price.toString(),
//         });

//         router.push(`/book?${params.toString()}`);
//     };

//     return (
//         <section className='bg-[#3c3d3f]'>
//             <div className='relative w-full h-auto flex items-center justify-center overflow-hidden py-20 px-4 lg:px-0'>
//                 <div className='absolute inset-0 hidden lg:block'>
//                     <Image
//                         src='/images/bg-cycle.jpg'
//                         alt='Background bicycle'
//                         fill
//                         className='object-cover object-center'
//                     />
//                 </div>

//                 <div className='container mx-auto px-4 lg:px-16 py-16 bg-black opacity-50 rounded-2xl max-w-6xl relative'>
//                     <motion.div
//                         className='text-center mb-12'
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6 }}
//                         viewport={{ once: true }}
//                     >
//                         <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
//                             Our services
//                         </h2>
//                         <p className='text-white max-w-2xl mx-auto'>
//                             Skip the hassle: our on demand bicycle servicing
//                             comes to you!
//                         </p>
//                     </motion.div>

//                     <motion.div
//                         className='flex justify-center mb-8'
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, delay: 0.2 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className='bg-[#3c3d3f] rounded-full p-1 flex items-center space-x-2 border border-[#4a4b4d]'>
//                             <Button
//                                 onClick={() => setIsGearBike(true)}
//                                 className={`px-6 py-2 rounded-full transition-all duration-300 ${
//                                     isGearBike
//                                         ? 'bg-[#9ee2ff] text-black'
//                                         : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
//                                 }`}
//                             >
//                                 Gear
//                             </Button>
//                             <Button
//                                 onClick={() => setIsGearBike(false)}
//                                 className={`px-6 py-2 rounded-full transition-all duration-300 ${
//                                     !isGearBike
//                                         ? 'bg-[#9ee2ff] text-black'
//                                         : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
//                                 }`}
//                             >
//                                 Non-Gear
//                             </Button>
//                         </div>
//                     </motion.div>

//                     <div className='grid lg:grid-cols-2 gap-8 items-start'>
//                         {/* Left Panel: Service List */}
//                         <motion.div
//                             className='space-y-4 flex lg:flex-col overflow-auto lg:overflow-hidden gap-6'
//                             initial={{ opacity: 0, x: -20 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.6, delay: 0.3 }}
//                             viewport={{ once: true }}
//                         >
//                             {Object.keys(serviceDetails).map((key, index) => {
//                                 const service =
//                                     serviceDetails[
//                                         key as keyof typeof serviceDetails
//                                     ];
//                                 return (
//                                     <motion.button
//                                         key={key}
//                                         onClick={() =>
//                                             setSelectedServiceKey(key)
//                                         }
//                                         className={`min-w-2xs lg:w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex justify-between items-center ${
//                                             selectedServiceKey === key
//                                                 ? 'bg-[#f5b41d] text-black border-[#f5b41d]'
//                                                 : 'bg-white text-black border-[#4a4b4d] hover:bg-[#2a2b2d]'
//                                         }`}
//                                         whileHover={{ scale: 1.02 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         initial={{ opacity: 0, y: 20 }}
//                                         whileInView={{ opacity: 1, y: 0 }}
//                                         transition={{
//                                             duration: 0.4,
//                                             delay: index * 0.1,
//                                         }}
//                                         viewport={{ once: true }}
//                                     >
//                                         <div className='flex items-center space-x-3'>
//                                             {selectedServiceKey === key && (
//                                                 <CheckCircle2 className='w-5 h-5' />
//                                             )}
//                                             <div>
//                                                 <span className='font-semibold text-lg'>
//                                                     {service.title}
//                                                 </span>
//                                                 <span className='block text-sm text-gray-600'>
//                                                     {isGearBike
//                                                         ? 'Gear'
//                                                         : 'Non-Gear'}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <span className='font-bold text-lg'>
//                                             {service.price} Rs
//                                         </span>
//                                     </motion.button>
//                                 );
//                             })}
//                         </motion.div>

//                         {/* Right Panel: Service Details */}
//                         <motion.div
//                             className='bg-white text-black rounded-lg p-6 border border-[#4a4b4d] shadow-lg'
//                             initial={{ opacity: 0, x: 20 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.6, delay: 0.4 }}
//                             viewport={{ once: true }}
//                             key={selectedServiceKey}
//                         >
//                             <div className='flex justify-between items-center mb-4'>
//                                 <div className='w-[70%]'>
//                                     <h3 className='text-2xl font-bold text-black'>
//                                         {currentService?.title}
//                                     </h3>
//                                     <p className='text-gray-700 text-sm'>
//                                         {currentService?.description}
//                                     </p>
//                                 </div>
//                                 <div className='absolute right-4 lg:right-16 text-2xl lg:text-4xl font-bold text-white bg-[#3c9306] w-fit px-4 py-2 rounded-l-full'>
//                                     {currentService?.price} Rs
//                                 </div>
//                             </div>

//                             <div className='mb-4'>
//                                 <Image
//                                     src={
//                                         currentService.image ||
//                                         '/placeholder.svg'
//                                     }
//                                     alt={currentService.title}
//                                     width={400}
//                                     height={200}
//                                     className='w-full h-48 object-cover rounded-lg'
//                                 />
//                             </div>

//                             <h4 className='text-lg font-semibold text-black mb-3'>
//                                 What we provide?
//                             </h4>
//                             <ul className='space-y-2 text-black'>
//                                 {currentService.features.map(
//                                     (feature, index) => (
//                                         <motion.li
//                                             key={index}
//                                             className='flex items-center space-x-2'
//                                             initial={{ opacity: 0, x: -10 }}
//                                             whileInView={{ opacity: 1, x: 0 }}
//                                             transition={{
//                                                 duration: 0.3,
//                                                 delay: index * 0.05,
//                                             }}
//                                             viewport={{ once: true }}
//                                         >
//                                             {feature.included ? (
//                                                 <CheckCircle2 className='w-5 h-5 text-[#4CAF50] flex-shrink-0' />
//                                             ) : (
//                                                 <XCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
//                                             )}
//                                             <span>{feature.name}</span>
//                                         </motion.li>
//                                     )
//                                 )}
//                             </ul>
//                         </motion.div>
//                     </div>

//                     {/* Book Now Button */}
//                     <motion.div
//                         className='mt-12 text-center'
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, delay: 0.5 }}
//                         viewport={{ once: true }}
//                     >
//                         <Button
//                             onClick={handleBookNow}
//                             disabled={isLoading}
//                             className='bg-[#f5b41d] hover:bg-[#f59e0b] text-black font-semibold px-12 py-4 text-xl rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50'
//                         >
//                             {isLoading ? 'Loading...' : 'Book Now'}
//                         </Button>
//                     </motion.div>
//                 </div>
//             </div>
//         </section>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import type { RootState, AppDispatch } from '@/lib/store';
import { getServicesAction } from '@/lib/actions/serviceActions';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ServicePrice {
    id: number;
    price: number;
    type: 'gear' | 'nonGear' | string;
}

interface Service {
    _id: number;
    serviceName: string;
    serviceShortDescription: string;
    isActive: boolean;
    serviceImageUrl: string;
    serviceChecks: string; // stringified array
    orderNo: number;
    createdAt: string;
    updatedAt: string;
    prices: ServicePrice[];
}

export default function ServicesSection() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        null
    );

    const [isGearBike, setIsGearBike] = useState(true);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { services, isLoading } = useSelector(
        (state: RootState) => state.services
    );

    const activeServices =
        services
            ?.filter((service: Service) => service.isActive)
            .sort((a: Service, b: Service) => a.orderNo - b.orderNo) || [];

    // Fetch services on component mount
    useEffect(() => {
        dispatch(getServicesAction('pune'));
    }, [dispatch]);

    useEffect(() => {
        if (activeServices.length > 0 && selectedServiceId === null) {
            setSelectedServiceId(activeServices[0]._id);
        }
    }, [activeServices, selectedServiceId]);

    const currentService = activeServices.find(
        (service: Service) => service._id === selectedServiceId
    );

    const getCurrentPrice = (service: Service) => {
        const bikeType = isGearBike ? 'gear' : 'nonGear';
        const priceObj = service.prices.find((p) => p.type === bikeType);
        return priceObj?.price || 0;
    };

    const getServiceChecks = (service: Service) => {
        try {
            return JSON.parse(service.serviceChecks) || [];
        } catch {
            return [];
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!currentService) return;

        const params = new URLSearchParams({
            serviceId: currentService._id.toString(),
            name: currentService.serviceName,
            type: isGearBike ? 'gear' : 'nonGear',
            price: getCurrentPrice(currentService).toString(),
        });

        router.push(`/book?${params.toString()}`);
    };

    if (isLoading && activeServices.length === 0) {
        return (
            <section className='bg-[#3c3d3f]'>
                <div className='relative w-full h-auto flex items-center justify-center overflow-hidden py-20 px-4 lg:px-0'>
                    <div className='container mx-auto px-4 lg:px-16 py-16 bg-black opacity-50 rounded-2xl max-w-6xl relative'>
                        <div className='text-center text-white'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#f5b41d] mx-auto mb-4'></div>
                            <p>Loading services...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='bg-[#3c3d3f]'>
            <div className='relative w-full h-auto flex items-center justify-center overflow-hidden py-20 px-4 lg:px-0'>
                <div className='absolute inset-0 hidden lg:block'>
                    <Image
                        src='/images/bg-cycle.jpg'
                        alt='Background bicycle'
                        fill
                        className='object-cover object-center'
                    />
                </div>

                <div className='container mx-auto px-4 lg:px-16 py-16 bg-black opacity-50 rounded-2xl max-w-6xl relative'>
                    <motion.div
                        className='text-center mb-12'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
                            Our services
                        </h2>
                        <p className='text-white max-w-2xl mx-auto'>
                            Skip the hassle: our on demand bicycle servicing
                            comes to you!
                        </p>
                    </motion.div>

                    <motion.div
                        className='flex justify-center mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className='bg-[#3c3d3f] rounded-full p-1 flex items-center space-x-2 border border-[#4a4b4d]'>
                            <Button
                                onClick={() => setIsGearBike(true)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                    isGearBike
                                        ? 'bg-[#9ee2ff] text-black'
                                        : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
                                }`}
                            >
                                Gear
                            </Button>
                            <Button
                                onClick={() => setIsGearBike(false)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                    !isGearBike
                                        ? 'bg-[#9ee2ff] text-black'
                                        : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
                                }`}
                            >
                                Non-Gear
                            </Button>
                        </div>
                    </motion.div>

                    <div className='grid lg:grid-cols-2 gap-8 items-start'>
                        {/* Left Panel: Service List */}
                        <motion.div
                            className='space-y-4 flex lg:flex-col overflow-auto lg:overflow-hidden gap-6'
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            {activeServices.map(
                                (service: Service, index: number) => {
                                    const currentPrice =
                                        getCurrentPrice(service);
                                    return (
                                        <motion.button
                                            key={service._id}
                                            onClick={() =>
                                                setSelectedServiceId(
                                                    service._id
                                                )
                                            }
                                            className={`min-w-2xs lg:w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex justify-between items-center ${
                                                selectedServiceId ===
                                                service._id
                                                    ? 'bg-[#f5b41d] text-black border-[#f5b41d]'
                                                    : 'bg-white text-black border-[#4a4b4d] hover:bg-[#2a2b2d]'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.1,
                                            }}
                                            viewport={{ once: true }}
                                        >
                                            <div className='flex items-center space-x-3'>
                                                {selectedServiceId ===
                                                    service._id && (
                                                    <CheckCircle2 className='w-5 h-5' />
                                                )}
                                                <div>
                                                    <span className='font-semibold text-lg'>
                                                        {service.serviceName}
                                                    </span>
                                                    <span className='block text-sm text-gray-600'>
                                                        {isGearBike
                                                            ? 'Gear'
                                                            : 'Non-Gear'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className='font-bold text-lg'>
                                                {currentPrice} Rs
                                            </span>
                                        </motion.button>
                                    );
                                }
                            )}
                        </motion.div>

                        {/* Right Panel: Service Details */}
                        {currentService && (
                            <motion.div
                                className='bg-white text-black rounded-lg p-6 border border-[#4a4b4d] shadow-lg'
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                key={selectedServiceId}
                            >
                                <div className='flex justify-between items-center mb-4'>
                                    <div className='w-[70%]'>
                                        <h3 className='text-2xl font-bold text-black'>
                                            {currentService.serviceName}
                                        </h3>
                                        <p className='text-gray-700 text-sm'>
                                            {
                                                currentService.serviceShortDescription
                                            }
                                        </p>
                                    </div>
                                    <div className='absolute right-4 lg:right-16 text-2xl lg:text-4xl font-bold text-white bg-[#3c9306] w-fit px-4 py-2 rounded-l-full'>
                                        {getCurrentPrice(currentService)} Rs
                                    </div>
                                </div>

                                <div className='mb-4'>
                                    <Image
                                        src={
                                            currentService.serviceImageUrl ||
                                            '/placeholder.svg?height=200&width=400&query=bicycle service'
                                        }
                                        alt={currentService.serviceName}
                                        width={400}
                                        height={200}
                                        className='w-full h-48 object-cover rounded-lg'
                                    />
                                </div>

                                <h4 className='text-lg font-semibold text-black mb-3'>
                                    What we provide?
                                </h4>
                                <ul className='space-y-2 text-black'>
                                    {getServiceChecks(currentService).map(
                                        (check: string, index: number) => (
                                            <motion.li
                                                key={index}
                                                className='flex items-center space-x-2'
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                }}
                                                viewport={{ once: true }}
                                            >
                                                <CheckCircle2 className='w-5 h-5 text-[#4CAF50] flex-shrink-0' />
                                                <span>{check}</span>
                                            </motion.li>
                                        )
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Book Now Button */}
                    <motion.div
                        className='mt-12 text-center'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            onClick={handleBookNow}
                            disabled={isLoading || !currentService}
                            className='bg-[#f5b41d] hover:bg-[#f59e0b] text-black font-semibold px-12 py-4 text-xl rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50'
                        >
                            {isLoading ? 'Loading...' : 'Book Now'}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
