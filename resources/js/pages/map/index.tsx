import { Head } from '@inertiajs/react';
import { MapPin, Users, X, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Layout from '@/layouts/Layout';
import FlagIcon from '@/components/FlagIcon';

interface Team {
    id: number;
    name: string;
    logo: string | null;
    founded_year: string;
}

interface Stadium {
    id: number;
    name: string;
    city: string;
    country: string;
    country_flag: string;
    latitude: number;
    longitude: number;
    capacity: number | null;
    image: string | null;
    teams: Team[];
}

interface MapPageProps {
    stadiums: Stadium[];
}

export default function MapPage({ stadiums }: MapPageProps) {
    const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const mapContainer = useRef<HTMLDivElement>(null);

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `/storage/${imagePath}`;
    };

    useEffect(() => {
        // Load Leaflet CSS and JS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);

        return () => {
            document.head.removeChild(link);
            document.body.removeChild(script);
            if (map) {
                map.remove();
            }
        };
    }, []);

    const initMap = () => {
        if (!mapContainer.current || map) return;

        // @ts-ignore
        const L = window.L;

        // Create map centered on Europe
        const newMap = L.map(mapContainer.current).setView([50, 10], 4);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(newMap);

        setMap(newMap);

        // Add markers for all stadiums
        const newMarkers: any[] = [];
        stadiums.forEach((stadium) => {
            // Custom icon
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div class="relative">
                        <div class="absolute -top-10 -left-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 shadow-lg border-2 border-white hover:scale-125 transition-transform cursor-pointer">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                    </div>
                `,
                iconSize: [0, 0],
            });

            const marker = L.marker([stadium.latitude, stadium.longitude], { icon })
                .addTo(newMap)
                .on('click', () => {
                    setSelectedStadium(stadium);
                });

            newMarkers.push(marker);
        });

        setMarkers(newMarkers);
    };

    const flyToStadium = (stadium: Stadium) => {
        if (map) {
            map.flyTo([stadium.latitude, stadium.longitude], 12, {
                duration: 1.5,
            });
            setSelectedStadium(stadium);
        }
    };

    return (
        <Layout>
            <Head title="Stadium Map" />

            <div className="relative h-screen overflow-hidden">
                {/* Map Container */}
                <div ref={mapContainer} className="h-full w-full" />

                {/* Search/Filter Panel */}
                <div className="absolute left-4 top-4 z-[1000] w-80 max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 p-4 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-white">
                            <MapPin className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Stadium Locations</h2>
                        </div>
                        <p className="mt-1 text-sm text-green-100">
                            {stadiums.length} stadiums worldwide
                        </p>
                    </div>

                    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-4">
                        <div className="space-y-2">
                            {stadiums.map((stadium) => (
                                <button
                                    key={stadium.id}
                                    onClick={() => flyToStadium(stadium)}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-green-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-green-500"
                                >
                                    <div className="mb-1 font-semibold text-gray-900 dark:text-white">
                                        {stadium.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <FlagIcon countryName={stadium.country} className="h-3 w-5 rounded" />
                                        <span>{stadium.city}, {stadium.country}</span>
                                    </div>
                                    {stadium.teams.length > 0 && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Users className="h-3 w-3" />
                                            <span>{stadium.teams.length} {stadium.teams.length === 1 ? 'team' : 'teams'}</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stadium Details Modal */}
                {selectedStadium && (
                    <div className="absolute inset-0 z-[1001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                            <button
                                onClick={() => setSelectedStadium(null)}
                                className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-700"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            {/* Stadium Image */}
                            {selectedStadium.image ? (
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getImageUrl(selectedStadium.image) || ''}
                                        alt={selectedStadium.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                                    <MapPin className="h-20 w-20 text-gray-400" />
                                </div>
                            )}

                            {/* Stadium Info */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                        {selectedStadium.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <FlagIcon countryName={selectedStadium.country} className="h-5 w-8 rounded shadow-sm" />
                                        <span className="text-lg">{selectedStadium.city}, {selectedStadium.country}</span>
                                    </div>
                                </div>

                                {selectedStadium.capacity && (
                                    <div className="mb-6 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                        <div className="mb-1 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <Users className="h-4 w-4" />
                                            <span>Capacity</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedStadium.capacity.toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {/* Teams */}
                                {selectedStadium.teams.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            Home Teams
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedStadium.teams.map((team) => (
                                                <div
                                                    key={team.id}
                                                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                                                >
                                                    {team.logo ? (
                                                        <img
                                                            src={team.logo}
                                                            alt={team.name}
                                                            className="h-12 w-12 rounded object-contain"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                                                            <span className="text-2xl">⚽</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {team.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Founded {team.founded_year}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={`/teams/${team.id}`}
                                                        className="rounded-lg bg-green-600 p-2 text-white transition-colors hover:bg-green-700"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Map Preview */}
                                <div className="overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600">
                                    <iframe
                                        width="100%"
                                        height="200"
                                        frameBorder="0"
                                        scrolling="no"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedStadium.longitude - 0.01},${selectedStadium.latitude - 0.01},${selectedStadium.longitude + 0.01},${selectedStadium.latitude + 0.01}&layer=mapnik&marker=${selectedStadium.latitude},${selectedStadium.longitude}`}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 z-[1000] rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Stadium Location
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                .leaflet-container {
                    height: 100%;
                    width: 100%;
                }
                .custom-marker {
                    background: transparent;
                    border: none;
                }
            `}</style>
        </Layout>
    );
}
