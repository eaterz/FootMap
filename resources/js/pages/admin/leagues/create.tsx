import { Head, router } from '@inertiajs/react';
import { ChevronLeft, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface Country {
    id: number;
    name: string;
}

interface Props {
    countries: Country[];
}

export default function Create({ countries }: Props) {
    const [formData, setFormData] = useState({
        country_id: '',
        name: '',
        logo: null as File | null,
        founded_year: '',
        description: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, logo: 'File size must be less than 5MB' }));
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, logo: 'Please upload an image file' }));
                return;
            }

            setFormData(prev => ({ ...prev, logo: file }));
            setErrors(prev => ({ ...prev, logo: '' }));

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
        setErrors(prev => ({ ...prev, logo: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('country_id', formData.country_id);
            data.append('name', formData.name);
            if (formData.logo) {
                data.append('logo', formData.logo);
            }
            let foundedYear = formData.founded_year;
            if (foundedYear) {
                foundedYear = `${foundedYear}-01-01`;
            }
            data.append('founded_year', foundedYear);
            data.append('description', formData.description);

            await axios.post('/admin/leagues', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Success - redirect to leagues index
            window.location.href = '/admin/leagues';
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ submit: 'An error occurred while creating the league. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Create League" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <a
                            href="/admin/leagues"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Leagues
                        </a>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New League</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add a new league to your sports management system</p>
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
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 bg-gray-50 dark:bg-gray-700/50">
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
                                                    Upload Logo
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
                                        {errors.logo && <p className="mt-2 text-sm text-red-600">{errors.logo}</p>}
                                    </div>
                                </div>

                                {/* Form Grid */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            League Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g., Premier League"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label htmlFor="country_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="country_id"
                                            name="country_id"
                                            value={formData.country_id}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select a country</option>
                                            {countries.map(country => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.country_id && <p className="mt-1.5 text-sm text-red-600">{errors.country_id}</p>}
                                    </div>

                                    {/* Founded Year */}
                                    <div>
                                        <label htmlFor="founded_year" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Founded Year
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
                                            placeholder="e.g., 1992"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        />
                                        {errors.founded_year && <p className="mt-1.5 text-sm text-red-600">{errors.founded_year}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Write a brief description about the league..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        />
                                        {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <a
                                    href="/admin/leagues"
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
                                            Creating...
                                        </>
                                    ) : (
                                        'Create League'
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
