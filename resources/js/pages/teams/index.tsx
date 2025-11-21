import { Head, Link, router } from '@inertiajs/react';
import { Search, Shield, Calendar, MapPin, Users, ExternalLink, X, Filter, Trophy, FileText } from 'lucide-react';
import { useState, FormEvent } from 'react';
import Layout from '@/layouts/Layout';
import FlagIcon from '@/components/FlagIcon';

interface League {
    id: number;
    name: string;
    country: string;
}

interface Team {
    id: number;
    name: string;
    logo: string | null;
    founded_year: string;
    description: string | null;
    website: string | null;
    league: string;
    country: string;
    country_flag: string;
    league_id: number;
    stadium: string;
    stadium_city: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Filters {
    search?: string;
    league?: string;
}

interface TeamsIndexProps {
    teams: {
        data: Team[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    leagues: League[];
    filters: Filters;
}

export default function TeamsIndex({ teams, leagues, filters }: TeamsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedLeague, setSelectedLeague] = useState(filters.league || '');
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedLeague) params.append('league', selectedLeague);

        router.get(`/teams?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedLeague('');
        router.get('/teams', {}, {
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
            <Head title="Teams" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-16">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-green-600 to-green-600 p-4">
                                <Shield className="h-12 w-12 text-white" />
                            </div>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                Football Teams
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Explore football clubs from leagues around the world
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
                                    placeholder="Search teams..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={selectedLeague}
                                        onChange={(e) => setSelectedLeague(e.target.value)}
                                        className="appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">All Leagues</option>
                                        {leagues.map((league) => (
                                            <option key={league.id} value={league.id}>
                                                {league.name} ({league.country})
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

                                {(searchTerm || selectedLeague) && (
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
                            Showing {teams.data.length} of {teams.total} {teams.total === 1 ? 'team' : 'teams'}
                        </div>
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {teams.data.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {teams.data.map((team) => (
                                    <div
                                        key={team.id}
                                        onClick={() => setSelectedTeam(team)}
                                        className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                                {team.logo ? (
                                                    <img
                                                        src={getLogoUrl(team.logo) || ''}
                                                        alt={team.name}
                                                        className="max-h-32 max-w-full object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <Shield className="h-24 w-24 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                                {team.name}
                                            </h3>

                                            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <FlagIcon countryName={team.country} className="h-4 w-6 rounded shadow-sm" />
                                                <span>{team.country}</span>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="h-4 w-4 text-blue-500" />
                                                    <span>{team.league}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-green-500" />
                                                    <span>{team.stadium}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-purple-500" />
                                                    <span>Founded {team.founded_year}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {teams.last_page > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    {teams.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveState
                                            preserveScroll
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
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
                                <Shield className="h-16 w-16 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                No teams found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Team Details Modal */}
            {selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setSelectedTeam(null)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    ></div>

                    <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-700"
                        >
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-gray-700 dark:to-gray-600">
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/20"></div>
                            <div className="relative">
                                {selectedTeam.logo ? (
                                    <img
                                        src={getLogoUrl(selectedTeam.logo) || ''}
                                        alt={selectedTeam.name}
                                        className="max-h-40 max-w-full object-contain drop-shadow-2xl"
                                    />
                                ) : (
                                    <Shield className="h-32 w-32 text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {selectedTeam.name}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <FlagIcon countryName={selectedTeam.country} className="h-5 w-8 rounded shadow-sm" />
                                    <span className="text-lg">{selectedTeam.country}</span>
                                </div>
                            </div>

                            {selectedTeam.description && (
                                <div className="mb-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <FileText className="h-4 w-4" />
                                        <span>About</span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                                        {selectedTeam.description}
                                    </p>
                                </div>
                            )}

                            <div className="mb-6 space-y-4">
                                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                        <Trophy className="h-4 w-4" />
                                        <span>League</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedTeam.league}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                        <MapPin className="h-4 w-4" />
                                        <span>Home Stadium</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedTeam.stadium}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {selectedTeam.stadium_city}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                                    <div className="mb-1 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>Founded</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedTeam.founded_year}
                                    </div>
                                </div>
                            </div>

                            {selectedTeam.website && (
                                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                    <a
                                        href={selectedTeam.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                    >
                                        <span>Visit Official Website</span>
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
