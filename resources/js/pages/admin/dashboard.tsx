import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Users, Shield, Database, Activity, MapPin, Globe2, Trophy } from 'lucide-react';

interface Stats {
    total_teams: number;
    total_stadiums: number;
    total_leagues: number;
    total_countries: number;
    total_users: number;
    admin_users: number;
    regular_users: number;
}

interface RecentTeam {
    id: number;
    name: string;
    logo: string | null;
    country: string | null;
    league: string | null;
    stadium: string | null;
    founded_year: number | null;
    created_at: string;
}

interface TeamsByCountry {
    country: string;
    total: number;
}

interface TeamsByLeague {
    league: string;
    total: number;
}

interface Props {
    stats: Stats;
    recent_teams: RecentTeam[];
    teams_by_country: TeamsByCountry[];
    teams_by_league: TeamsByLeague[];
}

export default function AdminDashboard({ stats, recent_teams, teams_by_country, teams_by_league }: Props) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your football database
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Teams
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_teams}
                                </p>
                            </div>
                            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Stadiums
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_stadiums}
                                </p>
                            </div>
                            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Leagues
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_leagues}
                                </p>
                            </div>
                            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Users
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_users}
                                </p>
                            </div>
                            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Countries
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_countries}
                                </p>
                            </div>
                            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900">
                                <Globe2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Admin Users
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.admin_users}
                                </p>
                            </div>
                            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Regular Users
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.regular_users}
                                </p>
                            </div>
                            <div className="rounded-lg bg-cyan-100 p-3 dark:bg-cyan-900">
                                <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Recent Teams */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Recent Teams
                        </h2>
                        <div className="space-y-4">
                            {recent_teams.length > 0 ? (
                                recent_teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-3">
                                            {team.logo ? (
                                                <img
                                                    src={team.logo}
                                                    alt={team.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {team.name}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {team.country} • {team.league}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {team.created_at}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 dark:text-gray-400">
                                    No teams yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Teams by Country */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Teams by Country (Top 5)
                        </h2>
                        <div className="space-y-4">
                            {teams_by_country.length > 0 ? (
                                teams_by_country.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-900 dark:text-white">
                                            {item.country}
                                        </span>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                            {item.total}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 dark:text-gray-400">
                                    No data available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Teams by League */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Teams by League (Top 5)
                        </h2>
                        <div className="space-y-4">
                            {teams_by_league.length > 0 ? (
                                teams_by_league.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-900 dark:text-white">
                                            {item.league}
                                        </span>
                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                                            {item.total}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 dark:text-gray-400">
                                    No data available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <button className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Add New Team
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Create a new football team
                                </p>
                            </button>

                            <button className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Add Stadium
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Register a new stadium
                                </p>
                            </button>

                            <button className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Manage Users
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    View and manage users
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
