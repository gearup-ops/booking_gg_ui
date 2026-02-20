'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import type { AppDispatch } from '@/lib/store';
import { setCityPopup } from '@/lib/slices/uiSlice';
import { setSelectedCityId as setReduxCityId } from '@/lib/slices/citySlice';
import { getCitiesAction } from '@/lib/actions/cityActions';
import { getLocaleStorage, setLocaleStorage } from '@/lib/utils';

export default function CityPopup() {
    const dispatch = useDispatch<AppDispatch>();
    const { cities } = useSelector((state: any) => state.city);
    const showCityPopup = useSelector((state: any) => state.ui.showCityPopup);

    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    // Track whether we've done the initial localStorage check
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Fetch cities on mount
    useEffect(() => {
        dispatch(getCitiesAction());
    }, [dispatch]);

    // On mount: if no city saved, show popup; otherwise hydrate Redux
    useEffect(() => {
        const savedCityId = getLocaleStorage('cityId');
        if (!savedCityId) {
            dispatch(setCityPopup(true));
        } else {
            dispatch(setReduxCityId(parseInt(savedCityId)));
        }
        setInitialCheckDone(true);
    }, [dispatch]);

    // When popup becomes visible, set the selected city:
    // - If a city is already saved, pre-select it
    // - Otherwise, default to the first available city
    useEffect(() => {
        if (showCityPopup && cities && cities.length > 0) {
            const savedCityId = getLocaleStorage('cityId');
            if (savedCityId) {
                const parsedId = parseInt(savedCityId);
                // Verify the saved city still exists in the list
                const cityExists = cities.some((c: any) => c.id === parsedId);
                setSelectedCityId(cityExists ? parsedId : cities[0].id);
            } else {
                setSelectedCityId(cities[0].id);
            }
        }
    }, [showCityPopup, cities]);

    const handleConfirm = useCallback(() => {
        if (selectedCityId !== null) {
            setLocaleStorage('cityId', selectedCityId.toString());
            dispatch(setReduxCityId(selectedCityId));
            dispatch(setCityPopup(false));
        }
    }, [selectedCityId, dispatch]);

    const handleDismiss = useCallback(() => {
        dispatch(setCityPopup(false));
    }, [dispatch]);

    // Don't render until initial check is done
    if (!initialCheckDone) return null;

    // Only show if Redux says to show
    if (!showCityPopup) return null;

    // Don't show empty popup if cities haven't loaded yet
    if (!cities || cities.length === 0) return null;

    const hasSavedCity = !!getLocaleStorage('cityId');

    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
            <div className='bg-white text-black rounded-lg p-6 min-w-[300px] shadow-lg relative'>
                {hasSavedCity && (
                    <button
                        onClick={handleDismiss}
                        className='absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 transition-colors'
                        aria-label='Close'
                    >
                        <X className='w-4 h-4 text-gray-500' />
                    </button>
                )}
                <h2 className='text-lg font-semibold mb-4'>Select your city</h2>
                <div className='grid grid-cols-2 gap-2 mb-4'>
                    {cities.map((city: any) => (
                        <button
                            key={city.id}
                            className={`w-full p-2 border rounded ${
                                selectedCityId === city.id
                                    ? 'bg-[#fbbf24] text-white border-blue-600'
                                    : 'bg-white text-black border-gray-300'
                            }`}
                            onClick={() => setSelectedCityId(city.id)}
                            type='button'
                        >
                            {city.name}
                        </button>
                    ))}
                </div>
                <button
                    className='bg-[#000] text-[#fbbf24] px-4 py-2 rounded w-full disabled:opacity-50'
                    onClick={handleConfirm}
                    disabled={selectedCityId === null}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}
