import { Head, Link } from '@inertiajs/react';
import { Shield, Calendar, MapPin, ExternalLink, ArrowLeft, Users, Trophy, FileText, Clock, Info } from 'lucide-react';
import Layout from '@/layouts/Layout';
import FlagIcon from '@/components/FlagIcon';

interface Stadium {
    id: number;
    name: string;
    city: string;
    capacity: number | null;
    latitude: number;
    longitude: number;
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
    stadium: Stadium;
}

interface Match {
    id: number;
    date: string;
    time: string;
    timestamp: number;
    venue: string;
    status: string;
    competition: string;
    competition_logo: string | null;
    home_team: {
        name: string;
        logo: string;
    };
    away_team: {
        name: string;
        logo: string;
    };
    round: number | null;
    season: string | null;
}

interface TeamShowProps {
    team: Team;
    upcomingMatches: Match[];
}

export default function TeamShow({ team, upcomingMatches }: TeamShowProps) {
    const getLogoUrl = (logoPath: string | null) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
            return logoPath;
        }
        return `/storage/${logoPath}`;
    };

    const formatMatchDate = (dateString: string, timeString: string) => {
        if (!dateString) return 'TBA';

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        const formattedTime = timeString || 'TBA';

        if (isToday) {
            return `Today at ${formattedTime}`;
        } else if (isTomorrow) {
            return `Tomorrow at ${formattedTime}`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + (timeString ? ` at ${timeString}` : '');
        }
    };

    const isHomeTeam = (match: Match) => {
        return match.home_team.name.toLowerCase().includes(team.name.toLowerCase()) ||
            team.name.toLowerCase().includes(match.home_team.name.toLowerCase());
    };

    return (
        <Layout>
            <Head title={team.name} />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950">
                {/* Back Button */}
                <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <Link
                            href="/teams"
                            className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Teams</span>
                        </Link>
                    </div>
                </div>

                {/* Team Header */}
                <div className="relative overflow-hidden py-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                            {/* Team Logo */}
                            <div className="flex-shrink-0">
                                <div className="relative h-32 w-32 rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800">
                                    {team.logo ? (
                                        <img
                                            src={getLogoUrl(team.logo) || ''}
                                            alt={team.name}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <Shield className="h-full w-full text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Team Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                                    {team.name}
                                </h1>
                                <div className="mb-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <FlagIcon countryName={team.country} className="h-5 w-8 rounded shadow-sm" />
                                        <span className="text-lg text-gray-600 dark:text-gray-300">{team.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <Trophy className="h-5 w-5 text-blue-500" />
                                        <span>{team.league}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-5 w-5 text-purple-500" />
                                        <span>Founded {team.founded_year}</span>
                                    </div>
                                </div>
                                {team.website && (
                                    <a
                                        href={team.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <span>Visit Official Website</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            {team.description && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">About</h2>
                                    </div>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                        {team.description}
                                    </p>
                                </div>
                            )}

                            {/* Upcoming Matches */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-6 flex items-center gap-2">
                                    <Clock className="h-6 w-6 text-green-600 dark:text-green-500" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Upcoming Matches
                                    </h2>
                                </div>

                                {upcomingMatches.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingMatches.map((match) => {
                                            const isHome = isHomeTeam(match);
                                            return (
                                                <div
                                                    key={match.id}
                                                    className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white transition-all hover:shadow-md dark:border-gray-700 dark:from-gray-700 dark:to-gray-800"
                                                >
                                                    {/* Match Header */}
                                                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-700">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                {match.competition_logo && (
                                                                    <img
                                                                        src={match.competition_logo}
                                                                        alt={match.competition}
                                                                        className="h-5 w-5 object-contain"
                                                                    />
                                                                )}
                                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                    {match.competition}
                                                                    {match.round && ` - Round ${match.round}`}
                                                                </span>
                                                            </div>
                                                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                {match.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Teams */}
                                                    <div className="p-4">
                                                        <div className="mb-4 flex items-center justify-between">
                                                            {/* Home Team */}
                                                            <div className={`flex flex-1 items-center gap-3 ${isHome ? 'font-bold' : ''}`}>
                                                                {match.home_team.logo ? (
                                                                    <img
                                                                        src={match.home_team.logo}
                                                                        alt={match.home_team.name}
                                                                        className="h-10 w-10 object-contain"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                                        <Shield className="h-6 w-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <span className="text-gray-900 dark:text-white">
                                                                    {match.home_team.name}
                                                                </span>
                                                            </div>

                                                            {/* VS */}
                                                            <div className="mx-4 text-sm font-bold text-gray-400">VS</div>

                                                            {/* Away Team */}
                                                            <div className={`flex flex-1 flex-row-reverse items-center gap-3 ${!isHome ? 'font-bold' : ''}`}>
                                                                {match.away_team.logo ? (
                                                                    <img
                                                                        src={match.away_team.logo}
                                                                        alt={match.away_team.name}
                                                                        className="h-10 w-10 object-contain"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                                        <Shield className="h-6 w-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <span className="text-right text-gray-900 dark:text-white">
                                                                    {match.away_team.name}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Match Details */}
                                                        <div className="space-y-2 border-t border-gray-200 pt-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-purple-500" />
                                                                <span>{formatMatchDate(match.date, match.time)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-green-500" />
                                                                <span>{match.venue}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-700">
                                            <Info className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                            No Upcoming Matches
                                        </h3>
                                        <p className="text-center text-gray-600 dark:text-gray-400">
                                            There are no scheduled matches available for this team at the moment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Stadium Info */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-500" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Home Stadium</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {team.stadium.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {team.stadium.city}, {team.country}
                                        </div>
                                    </div>
                                    {team.stadium.capacity && (
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Capacity</div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-500" />
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {team.stadium.capacity.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-700">
                                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Quick Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">League</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{team.league}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Founded</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{team.founded_year}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Country</span>
                                        <span className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                            <FlagIcon countryName={team.country} className="h-4 w-6 rounded" />
                                            {team.country}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
