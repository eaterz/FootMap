import { Head, router } from '@inertiajs/react';
import { ChevronLeft, Upload, X, Image as ImageIcon, Loader2, Trophy, MapPin, Calendar, Globe } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface League {
    id: number;
    name: string;
    country: string;
}

interface Stadium {
    id: number;
    name: string;
    city: string;
    country: string;
}

interface Team {
    id: number;
    name: string;
    league_id: number;
    stadium_id: number;
    logo: string | null;
    logo_path: string | null;
    founded_year: string | null;
    website: string | null;
}

interface Props {
    team: Team;
    leagues: League[];
    stadiums: Stadium[];
}

export default function Edit({ team, leagues, stadiums }: Props) {
    const initialYear = team.founded_year ? team.founded_year.split('-')[0] : '';

    const [formData, setFormData] = useState({
        league_id: team.league_id.toString(),
        stadium_id: team.stadium_id.toString(),
        name: team.name,
        logo: null as File | null,
        founded_year: initialYear,
        website: team.website || '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [logoPreview, setLogoPreview] = useState<string | null>(team.logo);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoChanged, setLogoChanged] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, logo: 'File size must be less than 5MB' }));
                return;
            }
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, logo: 'Please upload an image file' }));
                return;
            }
            setFormData(prev => ({ ...prev, logo: file }));
            setErrors(prev => ({ ...prev, logo: '' }));
            setLogoChanged(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setFormData(prev => ({ ...prev, logo: null }));
        setLogoPreview(null);
        setLogoChanged(true);
        setErrors(prev => ({ ...prev, logo: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const data = new FormData();
            data.append('_method', 'PUT');
            data.append('league_id', formData.league_id);
            data.append('stadium_id', formData.stadium_id);
            data.append('name', formData.name);

            if (logoChanged) {
                if (formData.logo) {
                    data.append('logo', formData.logo);
                } else {
                    data.append('remove_logo', '1');
                }
            }

            let foundedYear = formData.founded_year;
            if (foundedYear) {
                foundedYear = `${foundedYear}-01-01`;
            }
            data.append('founded_year', foundedYear);
            data.append('website', formData.website);

            await axios.post(`/admin/teams/${team.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            window.location.href = '/admin/teams';
        } catch (error: any) {
            console.error('Submit error:', error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ submit: 'An error occurred while updating the team. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group stadiums by country
    const stadiumsByCountry = stadiums.reduce((acc, stadium) => {
        if (!acc[stadium.country]) {
            acc[stadium.country] = [];
        }
        acc[stadium.country].push(stadium);
        return acc;
    }, {} as Record<string, Stadium[]>);

    // Group leagues by country
    const leaguesByCountry = leagues.reduce((acc, league) => {
        if (!acc[league.country]) {
            acc[league.country] = [];
        }
        acc[league.country].push(league);
        return acc;
    }, {} as Record<string, League[]>);

    return (
        <>
            <Head title={`Edit ${team.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950 p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <a
                            href="/admin/teams"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Teams
                        </a>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Team</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Update team information</p>
                    </div>

                    {/* Global Error Message */}
                    {errors.submit && (
                        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                        </div>
                    )}

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-8">
                                {/* Logo Upload Section */}
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50">
                                    <div className="text-center">
                                        {logoPreview ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="h-32 w-32 rounded-xl object-contain bg-white dark:bg-gray-800 p-2 shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 shadow-lg transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4">
                                                    <ImageIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                                                </div>
                                                <label
                                                    htmlFor="logo"
                                                    className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    Upload New Logo
                                                </label>
                                                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                        <input
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {errors.logo && <p className="text-center text-sm text-red-600 mb-2">{errors.logo}</p>}
                                    {logoChanged && (
                                        <div className="text-center text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded px-2 py-1">
                                            Logo will be updated when you save
                                        </div>
                                    )}
                                </div>

                                {/* Form Grid */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Team Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Team Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g., Manchester United"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* League */}
                                    <div>
                                        <label htmlFor="league_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Trophy className="inline h-4 w-4 mr-1" /> League <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="league_id"
                                            name="league_id"
                                            value={formData.league_id}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select a league</option>
                                            {Object.entries(leaguesByCountry).map(([country, countryLeagues]) => (
                                                <optgroup key={country} label={country}>
                                                    {countryLeagues.map(league => (
                                                        <option key={league.id} value={league.id}>
                                                            {league.name}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                        {errors.league_id && <p className="mt-1.5 text-sm text-red-600">{errors.league_id}</p>}
                                    </div>

                                    {/* Stadium */}
                                    <div>
                                        <label htmlFor="stadium_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <MapPin className="inline h-4 w-4 mr-1" /> Stadium <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="stadium_id"
                                            name="stadium_id"
                                            value={formData.stadium_id}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select a stadium</option>
                                            {Object.entries(stadiumsByCountry).map(([country, countryStadiums]) => (
                                                <optgroup key={country} label={country}>
                                                    {countryStadiums.map(stadium => (
                                                        <option key={stadium.id} value={stadium.id}>
                                                            {stadium.name} ({stadium.city})
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                        {errors.stadium_id && <p className="mt-1.5 text-sm text-red-600">{errors.stadium_id}</p>}
                                    </div>

                                    {/* Founded Year */}
                                    <div>
                                        <label htmlFor="founded_year" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Calendar className="inline h-4 w-4 mr-1" /> Founded Year <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="founded_year"
                                            name="founded_year"
                                            type="number"
                                            min="1800"
                                            max={new Date().getFullYear()}
                                            step="1"
                                            value={formData.founded_year}
                                            onChange={handleChange}
                                            placeholder="e.g., 1878"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        {errors.founded_year && <p className="mt-1.5 text-sm text-red-600">{errors.founded_year}</p>}
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Globe className="inline h-4 w-4 mr-1" /> Website
                                        </label>
                                        <input
                                            id="website"
                                            name="website"
                                            type="url"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://example.com"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        />
                                        {errors.website && <p className="mt-1.5 text-sm text-red-600">{errors.website}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <a
                                    href="/admin/teams"
                                    className={`rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${
                                        isSubmitting ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-lg bg-green-600 px-8 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 disabled:hover:shadow-none inline-flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Team'
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
