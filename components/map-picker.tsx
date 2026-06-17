'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    position: [number, number] | null;
    onPositionChange: (pos: [number, number]) => void;
}

function LocationMarker({ position, onPositionChange }: MapPickerProps) {
    useMapEvents({
        click(e) {
            onPositionChange([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13); // Instant jump instead of flying animation
        }
    }, [center, map]);
    return null;
}

export default function MapPicker({ position, onPositionChange }: MapPickerProps) {
    const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default to India center

    useEffect(() => {
        if (position) {
            setMapCenter(position);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    // ignore error, stick to default
                }
            );
        }
    }, [position]);

    return (
        <div className="w-full h-[300px] rounded-md overflow-hidden border border-[#4a4b4d]">
            <MapContainer
                center={mapCenter}
                zoom={position ? 13 : 5}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} onPositionChange={onPositionChange} />
                <MapController center={mapCenter} />
            </MapContainer>
        </div>
    );
}
