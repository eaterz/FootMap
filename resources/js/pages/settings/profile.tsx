import { Head, Link, usePage, Form } from '@inertiajs/react';
import { ChevronLeft, User, Lock, Shield, Palette, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type SharedData } from '@/types';
import Layout from '@/layouts/Layout';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ mustVerifyEmail, status }: ProfileProps) {
    const { auth } = usePage<SharedData>().props;
    const [activePage, setActivePage] = useState('profile');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navItems = [
        { id: 'profile', label: 'Profile', icon: User, href: '/settings/profile' },
        { id: 'password', label: 'Password', icon: Lock, href: '/settings/password' },
        { id: 'two-factor', label: 'Two-Factor Auth', icon: Shield, href: '/settings/two-factor' },
        { id: 'appearance', label: 'Appearance', icon: Palette, href: '/settings/appearance' },
    ];

    return (
        <Layout>
            <Head title="Profile Settings" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                                Settings
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage your profile and account settings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="mb-8 flex flex-wrap gap-2 justify-center">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.id === activePage;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                                        isActive
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="mx-auto max-w-3xl">
                        <div className="space-y-8">
                            {/* Profile Information Card */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Profile Information
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Update your name and email address
                                    </p>
                                </div>

                                <Form
                                    {...ProfileController.update.form()}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                    className="space-y-6"
                                >
                                    {({ processing, recentlySuccessful, errors }) => (
                                        <>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={auth.user.name}
                                                    required
                                                    autoComplete="name"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                                    placeholder="Full name"
                                                    disabled={processing}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    defaultValue={auth.user.email}
                                                    required
                                                    autoComplete="email"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                                    placeholder="email@example.com"
                                                    disabled={processing}
                                                />
                                                {errors.email && (
                                                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                                                )}
                                            </div>

                                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
                                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                        Your email address is unverified.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            className="font-medium underline hover:no-underline"
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </p>
                                                    {status === 'verification-link-sent' && (
                                                        <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                            A new verification link has been sent to your email address.
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                {recentlySuccessful && (
                                                    <span className="text-sm text-green-600 dark:text-green-400">
                                                        ✓ Saved successfully
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </div>

                            {/* Delete Account Card */}
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Delete Account
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
                                >
                                    <Trash2 className="h-5 w-5" />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl dark:bg-gray-800 p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Are you sure?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
