import { Head, Link, router } from '@inertiajs/react';
import { Search, Trophy, Calendar, Users, ExternalLink, X, Filter, Globe2 } from 'lucide-react';
import { useState, FormEvent } from 'react';
import Layout from '@/layouts/Layout';
import FlagIcon from '@/components/FlagIcon';

interface Country {
    id: number;
    name: string;
    flag: string;
}

interface League {
    id: number;
    name: string;
    logo: string | null;
    country: string;
    country_flag: string;
    country_id: number;
    founded_year: string;
    description: string;
    resource_url: string | null;
    teams_count: number;
}

interface Filters {
    search?: string;
    country?: string;
}

interface LeaguesIndexProps {
    leagues: League[];
    countries: Country[];
    filters: Filters;
}

export default function LeaguesIndex({ leagues, countries, filters }: LeaguesIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCountry, setSelectedCountry] = useState(filters.country || '');
    const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCountry) params.append('country', selectedCountry);

        router.get(`/leagues?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedCountry('');
        router.get('/leagues', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getLogoUrl = (logoPath: string | null) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
            return logoPath;
        }
        return `/storage/${logoPath}`;
    };

    return (
        <Layout>
            <Head title="Leagues" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-16">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-green-600 to-green-600 p-4">
                                <Trophy className="h-12 w-12 text-white" />
                            </div>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                Football Leagues
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Explore professional football leagues from around the globe
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
                                    placeholder="Search leagues..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
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
                            Showing {leagues.length} {leagues.length === 1 ? 'league' : 'leagues'}
                        </div>
                    </div>
                </div>

                {/* Leagues Grid */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {leagues.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {leagues.map((league) => (
                                <div
                                    key={league.id}
                                    onClick={() => setSelectedLeague(league)}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                        <div className="absolute inset-0 flex items-center justify-center p-8">
                                            {league.logo ? (
                                                <img
                                                    src={getLogoUrl(league.logo) || ''}
                                                    alt={league.name}
                                                    className="max-h-32 max-w-full object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                                                />
                                            ) : (
                                                <Trophy className="h-24 w-24 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                            {league.name}
                                        </h3>

                                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <FlagIcon countryName={league.country} className="h-4 w-6 rounded shadow-sm" />
                                            <span>{league.country}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                <span>{league.founded_year}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <Users className="h-4 w-4" />
                                                <span>{league.teams_count} {league.teams_count === 1 ? 'team' : 'teams'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                                <Trophy className="h-16 w-16 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                No leagues found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* League Details Modal */}
            {selectedLeague && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setSelectedLeague(null)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    ></div>

                    <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                        <button
                            onClick={() => setSelectedLeague(null)}
                            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-700"
                        >
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="relative flex h-64 items-center justify-center bg-white p-8">
                            <div className="absolute inset-0 bg-white"></div>
                            <div className="relative">
                                {selectedLeague.logo ? (
                                    <img
                                        src={getLogoUrl(selectedLeague.logo) || ''}
                                        alt={selectedLeague.name}
                                        className="max-h-40 max-w-full object-contain drop-shadow-2xl"
                                    />
                                ) : (
                                    <Trophy className="h-32 w-32 text-white/90" />
                                )}
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {selectedLeague.name}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <FlagIcon countryName={selectedLeague.country} className="h-5 w-8 rounded shadow-sm" />
                                    <span className="text-lg">{selectedLeague.country}</span>
                                </div>
                            </div>

                            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>Founded</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedLeague.founded_year}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                        <Users className="h-4 w-4" />
                                        <span>Teams</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedLeague.teams_count}
                                    </div>
                                </div>
                            </div>

                            {selectedLeague.description && (
                                <div className="mb-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        <Globe2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        About
                                    </h3>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                        {selectedLeague.description}
                                    </p>
                                </div>
                            )}

                            {selectedLeague.resource_url && (
                                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                    <a
                                        href={selectedLeague.resource_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                    >
                                        <span>Learn more on Wikipedia</span>
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
