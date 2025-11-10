import { Head, router } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, MapPin, Users, X } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/layouts/AdminLayout';

interface Stadium {
    id: number;
    name: string;
    country: string;
    city: string;
    latitude: string;
    longitude: string;
    capacity: number | null;
    image: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    stadiums: {
        data: Stadium[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ stadiums }: Props) {
    const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const handleDelete = async (stadium: Stadium) => {
        if (!confirm(`Are you sure you want to delete ${stadium.name}?`)) {
            return;
        }

        setIsDeleting(stadium.id);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            await axios.post(`/admin/stadiums/${stadium.id}`, {
                _method: 'DELETE'
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });


            router.reload({ only: ['stadiums'] });
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete stadium. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;
        return `/storage/${imagePath}`;
    };

    const filteredStadiums = stadiums.data.filter(stadium =>
        stadium.name.toLowerCase().includes(search.toLowerCase()) ||
        stadium.country.toLowerCase().includes(search.toLowerCase()) ||
        stadium.city.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <Head title="Stadiums" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stadiums</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Manage stadium locations and information
                            </p>
                        </div>
                        <a
                            href="/admin/stadiums/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30"
                        >
                            <Plus className="h-4 w-4" />
                            Add Stadium
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stadiums</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stadiums.total}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by name, country or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400"
                        />
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Stadium
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Capacity
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
                                {filteredStadiums.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                    No stadiums found
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Get started by adding your first stadium
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStadiums.map((stadium) => (
                                        <tr
                                            key={stadium.id}
                                            className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {stadium.image ? (
                                                        <img
                                                            src={getImageUrl(stadium.image) || ''}
                                                            alt={stadium.name}
                                                            className="h-12 w-16 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                                            <MapPin className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {stadium.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900 dark:text-white">{stadium.city}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{stadium.country}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {stadium.capacity ? (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-white">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        {stadium.capacity.toLocaleString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {stadium.created_at}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedStadium(stadium)}
                                                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <a
                                                        href={`/admin/stadiums/${stadium.id}/edit`}
                                                        className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                                        title="Edit stadium"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(stadium)}
                                                        disabled={isDeleting === stadium.id}
                                                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
                                                        title="Delete stadium"
                                                    >
                                                        <Trash2 className={`h-4 w-4 ${isDeleting === stadium.id ? 'animate-pulse' : ''}`} />
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
                        {stadiums.last_page > 1 && (
                            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{filteredStadiums.length}</span> of{' '}
                                        <span className="font-medium">{stadiums.total}</span> stadiums
                                    </p>
                                    <div className="flex gap-2">
                                        {stadiums.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : link.url
                                                            ? 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                            : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stadium Details Modal */}
            {selectedStadium && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedStadium.name}
                                </h2>
                                <button
                                    onClick={() => setSelectedStadium(null)}
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Stadium Image */}
                            {selectedStadium.image ? (
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={getImageUrl(selectedStadium.image) || ''}
                                        alt={selectedStadium.name}
                                        className="h-64 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                                    <div className="text-center">
                                        <MapPin className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No image available</p>
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                            Location
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {selectedStadium.city}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedStadium.country}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                            Capacity
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {selectedStadium.capacity
                                            ? selectedStadium.capacity.toLocaleString()
                                            : 'Not specified'}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                                        Latitude
                                    </p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white font-mono">
                                        {parseFloat(selectedStadium.latitude).toFixed(6)}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                                        Longitude
                                    </p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white font-mono">
                                        {parseFloat(selectedStadium.longitude).toFixed(6)}
                                    </p>
                                </div>
                            </div>

                            {/* Map Preview */}
                            <div className="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                                <iframe
                                    width="100%"
                                    height="300"
                                    frameBorder="0"
                                    scrolling="no"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(selectedStadium.longitude) - 0.01},${parseFloat(selectedStadium.latitude) - 0.01},${parseFloat(selectedStadium.longitude) + 0.01},${parseFloat(selectedStadium.latitude) + 0.01}&layer=mapnik&marker=${selectedStadium.latitude},${selectedStadium.longitude}`}
                                ></iframe>
                            </div>

                            {/* Created Date */}
                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Created on {selectedStadium.created_at}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setSelectedStadium(null)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Close
                                </button>
                                <a
                                    href={`/admin/stadiums/${selectedStadium.id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit Stadium
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
