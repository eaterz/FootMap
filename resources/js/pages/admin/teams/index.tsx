import { Head, Link } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, X, Users, Trophy, MapPin, Calendar, Globe } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/layouts/AdminLayout';

interface Team {
    id: number;
    name: string;
    logo: string | null;
    founded_year: string | null;
    website: string | null;
    league: string | null;
    country: string | null;
    stadium: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    teams: {
        data: Team[];
        links: PaginationLink[];
        prev_page_url: string | null;
        next_page_url: string | null;
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Index({ teams }: Props) {
    const [search, setSearch] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [teamsData, setTeamsData] = useState(teams.data);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (team: Team) => {
        if (!confirm(`Are you sure you want to delete ${team.name}?`)) {
            return;
        }

        setIsDeleting(team.id);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            await axios.post(`/admin/teams/${team.id}`, {
                _method: 'DELETE'
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            setTeamsData(prevTeams => prevTeams.filter(t => t.id !== team.id));
            setSelectedTeam(null);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete team. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredTeams = teamsData.filter(team =>
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        (team.league && team.league.toLowerCase().includes(search.toLowerCase())) ||
        (team.country && team.country.toLowerCase().includes(search.toLowerCase()))
    );

    const getLogoUrl = (logoPath: string | null) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http')) return logoPath;
        return `/storage/${logoPath}`;
    };

    return (
        <AdminLayout>
            <Head title="Teams" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950 p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Manage football teams
                            </p>
                        </div>
                        <Link
                            href="/admin/teams/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30"
                        >
                            <Plus className="h-4 w-4" />
                            Add Team
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Teams</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{teams.total}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="🔍 Search by team name, league or country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 transition-colors"
                        />
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Team
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        League
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Stadium
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Founded
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredTeams.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users className="h-12 w-12 text-gray-400 mb-4" />
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                    No teams found
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {search ? 'Try a different search term' : 'Get started by adding your first team'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTeams.map((team) => (
                                        <tr
                                            key={team.id}
                                            className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {team.logo ? (
                                                        <img
                                                            src={getLogoUrl(team.logo) || ''}
                                                            alt={team.name}
                                                            className="h-12 w-12 rounded-lg object-contain bg-gray-50 dark:bg-gray-700 p-1"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                                            <Users className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {team.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {team.country || 'Unknown Country'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Trophy className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {team.league || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {team.stadium || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {team.founded_year || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {team.created_at}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedTeam(team)}
                                                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/teams/${team.id}/edit`}
                                                        className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                                        title="Edit team"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(team)}
                                                        disabled={isDeleting === team.id}
                                                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
                                                        title="Delete team"
                                                    >
                                                        <Trash2 className={`h-4 w-4 ${isDeleting === team.id ? 'animate-pulse' : ''}`} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {teams.last_page > 1 && (
                            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing page <span className="font-medium">{teams.current_page}</span> of{' '}
                                        <span className="font-medium">{teams.last_page}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        {teams.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 dark:bg-gray-800"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Team Details Modal */}
            {selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {selectedTeam.logo ? (
                                        <img
                                            src={getLogoUrl(selectedTeam.logo) || ''}
                                            alt={selectedTeam.name}
                                            className="h-16 w-16 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 p-2"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedTeam.name}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {selectedTeam.country || 'Unknown Country'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTeam(null)}
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Details Grid */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                            League
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {selectedTeam.league || 'Not Available'}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                            Stadium
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {selectedTeam.stadium || 'Not Available'}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                            Founded Year
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {selectedTeam.founded_year || 'Not Available'}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                            Website
                                        </p>
                                    </div>
                                    {selectedTeam.website ? (
                                        <a
                                            href={selectedTeam.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                                        >
                                            Visit Website
                                        </a>
                                    ) : (
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            Not Available
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Created on {selectedTeam.created_at}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setSelectedTeam(null)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/admin/teams/${selectedTeam.id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit Team
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
