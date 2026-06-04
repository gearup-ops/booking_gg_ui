'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { setCityPopup } from '@/lib/slices/uiSlice';
import { slugify, getLocaleStorage } from '@/lib/utils';

export default function ServicesBasePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { cities, selectedCityId } = useSelector((state: RootState) => state.city);
    const showCityPopup = useSelector((state: RootState) => state.ui.showCityPopup);

    useEffect(() => {
        const savedCityId = getLocaleStorage('cityId') || selectedCityId;
        
        if (!savedCityId) {
            // If no city is selected, force the popup to open
            dispatch(setCityPopup(true));
        } else if (cities && cities.length > 0) {
            // We have a city, find its slug and redirect to the city's base services page
            // The [city]/page.tsx will dynamically handle finding the first service.
            const userCity = cities.find((c: any) => c.id === parseInt(savedCityId.toString()));
            if (userCity) {
                router.replace(`/services/${slugify(userCity.name)}`);
            }
        }
    }, [selectedCityId, cities, dispatch, router]);

    return (
        <div className='min-h-screen bg-[#060608] text-white flex justify-center items-center'>
            <p className='text-xl text-[#fbbf24] animate-pulse'>
                {!getLocaleStorage('cityId') && !selectedCityId 
                    ? 'Please select a city to view services...' 
                    : 'Loading services...'}
            </p>
        </div>
    );
}
