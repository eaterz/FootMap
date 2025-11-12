import { Search, Filter, Trophy, Calendar, Users, ExternalLink, X, Globe2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import FlagIcon from '@/components/FlagIcon';
import Layout from '@/layouts/Layout';

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
    const [showModal, setShowModal] = useState(false);

    const filteredLeagues = useMemo(() => {
        return leagues.filter((league) => {
            const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = !selectedCountry || league.country_id === parseInt(selectedCountry);
            return matchesSearch && matchesCountry;
        });
    }, [leagues, searchTerm, selectedCountry]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCountry) params.append('country', selectedCountry);

        window.location.href = `/leagues?${params.toString()}`;
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedCountry('');
        window.location.href = '/leagues';
    };

    const openModal = (league: League) => {
        setSelectedLeague(league);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLeague(null);
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    return (
        <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                            <Trophy className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                            World Football Leagues
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            Explore professional football leagues from around the globe
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1 md:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                                    className="appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
                                onClick={handleSearch}
                                className="rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Apply
                            </button>

                            {(searchTerm || selectedCountry) && (
                                <button
                                    onClick={handleReset}
                                    className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredLeagues.length} {filteredLeagues.length === 1 ? 'league' : 'leagues'}
                    </div>
                </div>
            </div>

            {/* Leagues Grid */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {filteredLeagues.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredLeagues.map((league) => (
                            <div
                                key={league.id}
                                onClick={() => openModal(league)}
                                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 hover:border-purple-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-600"
                            >
                                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-700 dark:to-gray-800">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                                    {league.logo ? (
                                        <img
                                            src={league.logo}
                                            alt={league.name}
                                            className="relative z-10 max-h-32 max-w-full object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const parent = e.currentTarget.parentElement;
                                                if (parent && !parent.querySelector('.fallback-icon')) {
                                                    const fallback = document.createElement('div');
                                                    fallback.className = 'fallback-icon text-6xl';
                                                    fallback.textContent = '🏆';
                                                    parent.appendChild(fallback);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Trophy className="h-24 w-24 text-gray-400 dark:text-gray-500" />
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                                        {league.name}
                                    </h3>

                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <FlagIcon countryName={league.country} className="h-4 w-6 rounded shadow-sm" />
                                        <span className="font-medium">{league.country}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            <span>Est. {league.founded_year}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <Users className="h-4 w-4" />
                                            <span>{league.teams_count} teams</span>
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

            {/* Modal */}
            {showModal && selectedLeague && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    ></div>

                    <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 z-20 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white">
                            <div className="flex items-center gap-6">
                                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-4">
                                    {selectedLeague.logo ? (
                                        <img
                                            src={selectedLeague.logo}
                                            alt={selectedLeague.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <Trophy className="h-16 w-16" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="mb-2 text-3xl font-bold">{selectedLeague.name}</h2>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <FlagIcon countryName={selectedLeague.country} className="h-5 w-8 rounded shadow-md" />
                                        <span className="text-lg font-medium">{selectedLeague.country}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="mb-8 grid grid-cols-2 gap-4">
                                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-900/20 dark:to-purple-800/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>Founded</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedLeague.founded_year}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-4 dark:from-pink-900/20 dark:to-pink-800/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400">
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
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        <Globe2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        About
                                    </h3>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                        {selectedLeague.description}
                                    </p>
                                </div>
                            )}

                            {selectedLeague.resource_url && (
                                <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                                    <a
                                        href={selectedLeague.resource_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                    >
                                        <span className="font-medium">Learn more on Wikipedia</span>
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </Layout>
    );
}
