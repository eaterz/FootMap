import { Head, useForm } from '@inertiajs/react';
import { ChevronLeft, Upload, X, Image, Loader2, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Country {
    id: number;
    name: string;
}

interface Props {
    countries: Country[];
}

export default function Create({ countries }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        country_id: '',
        city: '',
        latitude: '51.5074',
        longitude: '-0.1278',
        capacity: '',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Initialize Leaflet map
    useEffect(() => {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Wait for CSS to load
        link.onload = () => {
            // Load Leaflet JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';

            script.onload = () => {
                // Initialize map after a small delay
                setTimeout(() => {
                    initMap();
                }, 200);
            };

            document.head.appendChild(script);
        };

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    const initMap = () => {
        const L = (window as any).L;

        if (!L || mapRef.current) return;

        try {
            // Initialize map
            const map = L.map('map').setView(
                [parseFloat(data.latitude), parseFloat(data.longitude)],
                6
            );

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            // Custom marker icon
            const customIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Add initial marker
            const marker = L.marker(
                [parseFloat(data.latitude), parseFloat(data.longitude)],
                {
                    draggable: true,
                    icon: customIcon
                }
            ).addTo(map);

            marker.bindPopup('Drag me or click on map!').openPopup();

            // Update coordinates when marker is dragged
            marker.on('dragend', function(e: any) {
                const position = e.target.getLatLng();
                setData(prev => ({
                    ...prev,
                    latitude: position.lat.toFixed(6),
                    longitude: position.lng.toFixed(6)
                }));
                marker.getPopup().setContent(`Location: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
            });

            // Update marker on map click
            map.on('click', function(e: any) {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                setData(prev => ({
                    ...prev,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6)
                }));
                marker.getPopup().setContent(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            });

            mapRef.current = map;
            markerRef.current = marker;
            setMapLoaded(true);

            // Force resize after initialization
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    };

    // Update marker position when coordinates change manually
    useEffect(() => {
        if (markerRef.current && mapRef.current && mapLoaded) {
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);

            if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                markerRef.current.setLatLng([lat, lng]);
                mapRef.current.setView([lat, lng], mapRef.current.getZoom());
                markerRef.current.getPopup().setContent(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
        }
    }, [data.latitude, data.longitude, mapLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as any, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            setData('image', file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/stadiums');
    };

    return (
        <>
            <Head title="Create Stadium" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 p-6">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <a
                            href="/admin/stadiums"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Stadiums
                        </a>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Stadium</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add a new stadium to the database</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-8">
                                {/* Image Upload Section */}
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50">
                                    <div className="text-center mb-4">
                                        {imagePreview ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={imagePreview}
                                                    alt="Stadium preview"
                                                    className="h-32 w-48 rounded-xl object-cover shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 shadow-lg transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4">
                                                    <Image className="h-10 w-10 text-green-600 dark:text-green-400" />
                                                </div>
                                                <label
                                                    htmlFor="image"
                                                    className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    Upload Stadium Image
                                                </label>
                                                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            disabled={processing}
                                        />
                                    </div>
                                    {errors.image && <p className="text-center text-sm text-red-600 mb-2">{errors.image}</p>}
                                </div>

                                {/* Stadium Details */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Stadium Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Stadium Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={handleChange}
                                            placeholder="e.g., Old Trafford"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50"
                                            required
                                            disabled={processing}
                                        />
                                        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label htmlFor="country_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="country_id"
                                            name="country_id"
                                            value={data.country_id}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-green-400 transition-colors disabled:opacity-50"
                                            required
                                            disabled={processing}
                                        >
                                            <option value="">Select a country</option>
                                            {countries.map(country => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.country_id && <p className="mt-1.5 text-sm text-red-600">{errors.country_id}</p>}
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            value={data.city}
                                            onChange={handleChange}
                                            placeholder="e.g., Manchester"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50"
                                            required
                                            disabled={processing}
                                        />
                                        {errors.city && <p className="mt-1.5 text-sm text-red-600">{errors.city}</p>}
                                    </div>

                                    {/* Capacity */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Capacity
                                        </label>
                                        <input
                                            id="capacity"
                                            name="capacity"
                                            type="number"
                                            value={data.capacity}
                                            onChange={handleChange}
                                            placeholder="e.g., 75000"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50"
                                            disabled={processing}
                                        />
                                        {errors.capacity && <p className="mt-1.5 text-sm text-red-600">{errors.capacity}</p>}
                                    </div>
                                </div>

                                {/* Interactive Map Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Location <span className="text-red-500">*</span>
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        🗺️ Click on the map to place a marker or drag it to adjust the position
                                    </p>

                                    {/* Map Container */}
                                    <div
                                        id="map"
                                        className="h-96 w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg mb-4 bg-gray-100 dark:bg-gray-700"
                                    ></div>

                                    {/* Coordinate Inputs */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Latitude <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="latitude"
                                                name="latitude"
                                                type="number"
                                                step="any"
                                                value={data.latitude}
                                                onChange={handleChange}
                                                placeholder="e.g., 51.5074"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50"
                                                required
                                                disabled={processing}
                                            />
                                            {errors.latitude && <p className="mt-1.5 text-sm text-red-600">{errors.latitude}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Longitude <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="longitude"
                                                name="longitude"
                                                type="number"
                                                step="any"
                                                value={data.longitude}
                                                onChange={handleChange}
                                                placeholder="e.g., -0.1278"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50"
                                                required
                                                disabled={processing}
                                            />
                                            {errors.longitude && <p className="mt-1.5 text-sm text-red-600">{errors.longitude}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <a
                                    href="/admin/stadiums"
                                    className={`rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${
                                        processing ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-8 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 disabled:hover:shadow-none inline-flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Stadium'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
