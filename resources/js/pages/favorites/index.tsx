import { Head, Link, router } from '@inertiajs/react';
import { Heart, Shield, Calendar, MapPin, Trophy, ExternalLink, Eye, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import Layout from '@/layouts/Layout';
import FlagIcon from '@/components/FlagIcon';

interface FavoriteTeam {
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
    favorited_at: string;
}

interface FavoritesIndexProps {
    favoriteTeams: FavoriteTeam[];
    auth: {
        user: any;
    };
}

export default function FavoritesIndex({ favoriteTeams, auth }: FavoritesIndexProps) {
    const [teams, setTeams] = useState<FavoriteTeam[]>(favoriteTeams);
    const [removingTeam, setRemovingTeam] = useState<number | null>(null);

    const removeFavorite = async (teamId: number, teamName: string) => {
        if (!confirm(`Remove ${teamName} from your favorites?`)) {
            return;
        }

        setRemovingTeam(teamId);

        try {
            await axios.delete(`/favorites/${teamId}`);

            setTeams(prev => prev.filter(team => team.id !== teamId));


            console.log(`${teamName} removed from favorites`);
        } catch (error: any) {
            console.error('Error removing favorite:', error);
            if (error.response?.status === 401) {
                router.visit('/login');
            }
        } finally {
            setRemovingTeam(null);
        }
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
            <Head title="My Favorite Teams" />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-yellow-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-16">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 p-4">
                                <Heart className="h-12 w-12 text-white fill-white" />
                            </div>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                My Favorite Teams
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Your collection of favorite football clubs
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {teams.length > 0 ? (
                        <>
                            <div className="mb-6 flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {teams.length} {teams.length === 1 ? 'team' : 'teams'} in your favorites
                                </div>
                                <Link
                                    href="/teams"
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                >
                                    <Shield className="h-4 w-4" />
                                    <span>Browse All Teams</span>
                                </Link>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFavorite(team.id, team.name)}
                                            disabled={removingTeam === team.id}
                                            className={`absolute right-3 top-3 z-10 rounded-full p-2 transition-all ${
                                                removingTeam === team.id
                                                    ? 'cursor-wait opacity-50'
                                                    : 'hover:scale-110'
                                            } bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50`}
                                            title="Remove from favorites"
                                        >
                                            <Trash2
                                                className={`h-5 w-5 ${
                                                    removingTeam === team.id ? 'animate-pulse' : ''
                                                }`}
                                            />
                                        </button>

                                        {/* Favorited Badge */}
                                        <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-yellow-900 shadow-lg">
                                            <Heart className="h-3 w-3 fill-yellow-900" />
                                            <span>Favorited</span>
                                        </div>

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

                                            {team.favorited_at && (
                                                <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                                    <Heart className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    <span>Added {team.favorited_at}</span>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="mt-4 flex gap-2">
                                                <Link
                                                    href={`/teams/${team.id}`}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-green-700 hover:to-green-800"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span>View Details</span>
                                                </Link>

                                                {team.website && (
                                                    <a
                                                        href={team.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center rounded-lg border-2 border-green-600 bg-white px-3 py-2 text-sm font-semibold text-green-600 transition-all hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                                                        title="Visit website"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="mb-6 rounded-full bg-yellow-100 p-8 dark:bg-yellow-900/20">
                                <Heart className="h-20 w-20 text-yellow-400" />
                            </div>
                            <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                                No Favorite Teams Yet
                            </h3>
                            <p className="mb-6 max-w-md text-center text-gray-600 dark:text-gray-400">
                                Start building your collection by adding your favorite football teams!
                            </p>
                            <Link
                                href="/teams"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:from-green-700 hover:to-green-800 hover:shadow-lg"
                            >
                                <Shield className="h-5 w-5" />
                                <span>Browse Teams</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Info Card */}
                {teams.length > 0 && (
                    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/20">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold text-blue-900 dark:text-blue-300">
                                        About Your Favorites
                                    </h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-400">
                                        Your favorite teams are saved to your account and will be available across all your devices.
                                        Click on any team to view detailed information, upcoming matches, and more.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
