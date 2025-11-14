import { Head, Link, router } from '@inertiajs/react';
import { Search, MapPin, Users, Globe2, X, Filter } from 'lucide-react';
import { useState, FormEvent } from 'react';
import Layout from '@/layouts/Layout';
import FlagIcon from '@/components/FlagIcon';

interface Country {
    id: number;
    name: string;
    flag: string;
}

interface Team {
    id: number;
    name: string;
    logo: string | null;
}

interface Stadium {
    id: number;
    name: string;
    city: string;
    country: string;
    country_flag: string;
    country_id: number;
    latitude: string;
    longitude: string;
    capacity: number | null;
    image: string | null;
    teams_count: number;
    teams: Team[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Filters {
    search?: string;
    country?: string;
}

interface StadiumsIndexProps {
    stadiums: {
        data: Stadium[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    countries: Country[];
    filters: Filters;
}

export default function StadiumsIndex({ stadiums, countries, filters }: StadiumsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCountry, setSelectedCountry] = useState(filters.country || '');
    const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCountry) params.append('country', selectedCountry);

        router.get(`/stadiums?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedCountry('');
        router.get('/stadiums', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };



    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `/storage/${imagePath}`;
    };
    return (
        <Layout>
            <Head title="Stadiums" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-16">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-6 inline-flex rounded-2xl bg-green-600 p-4">
                                <MapPin className="h-12 w-12 text-white" />
                            </div>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                Football Stadiums
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Discover iconic stadiums from around the world
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="sticky top-16 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search stadiums by name or city..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        className="appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">All Countries</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Apply
                                </button>

                                {(searchTerm || selectedCountry) && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Showing {stadiums.data.length} of {stadiums.total} {stadiums.total === 1 ? 'stadium' : 'stadiums'}
                        </div>
                    </div>
                </div>

                {/* Stadiums Grid */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {stadiums.data.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {stadiums.data.map((stadium) => (
                                    <div
                                        key={stadium.id}
                                        onClick={() => setSelectedStadium(stadium)}
                                        className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            {stadium.image ? (
                                                <img
                                                    src={getImageUrl(stadium.image) || ''}
                                                    alt={stadium.name}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <MapPin className="h-16 w-16 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                                {stadium.name}
                                            </h3>

                                            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <FlagIcon countryName={stadium.country} className="h-4 w-6 rounded shadow-sm" />
                                                <span>{stadium.city}, {stadium.country}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                {stadium.capacity && (
                                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                        <Users className="h-4 w-4" />
                                                        <span>{stadium.capacity.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                    <Globe2 className="h-4 w-4" />
                                                    <span>{stadium.teams_count} {stadium.teams_count === 1 ? 'team' : 'teams'}</span>
                                                </div>
                                            </div>

                                            {stadium.teams.length > 0 && (
                                                <div className="mt-4 flex -space-x-2">
                                                    {stadium.teams.map((team) => (
                                                        <div
                                                            key={team.id}
                                                            className="h-8 w-8 rounded-full border-2 border-white bg-white dark:border-gray-800 dark:bg-gray-700"
                                                            title={team.name}
                                                        >
                                                            {team.logo ? (
                                                                <img
                                                                    src={team.logo}
                                                                    alt={team.name}
                                                                    className="h-full w-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-xs">
                                                                    ⚽
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {stadiums.last_page > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    {stadiums.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveState
                                            preserveScroll
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-green-600 text-white'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                        : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                                <MapPin className="h-16 w-16 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                No stadiums found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stadium Details Modal */}
            {selectedStadium && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setSelectedStadium(null)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    ></div>

                    <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                        <button
                            onClick={() => setSelectedStadium(null)}
                            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-700"
                        >
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>

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

                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {selectedStadium.name}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <FlagIcon countryName={selectedStadium.country} className="h-5 w-8 rounded shadow-sm" />
                                    <span className="text-lg">{selectedStadium.city}, {selectedStadium.country}</span>
                                </div>
                            </div>

                            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                                {selectedStadium.capacity && (
                                    <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                        <div className="mb-1 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <Users className="h-4 w-4" />
                                            <span>Capacity</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedStadium.capacity.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                        <Globe2 className="h-4 w-4" />
                                        <span>Home Teams</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedStadium.teams_count}
                                    </div>
                                </div>
                            </div>

                            {selectedStadium.teams.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        Teams
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
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                                                        <span className="text-xl">⚽</span>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {team.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                                <iframe
                                    width="100%"
                                    height="300"
                                    frameBorder="0"
                                    scrolling="no"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(selectedStadium.longitude) - 0.01},${parseFloat(selectedStadium.latitude) - 0.01},${parseFloat(selectedStadium.longitude) + 0.01},${parseFloat(selectedStadium.latitude) + 0.01}&layer=mapnik&marker=${selectedStadium.latitude},${selectedStadium.longitude}`}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
