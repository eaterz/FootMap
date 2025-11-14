import { Head, Link, Form } from '@inertiajs/react';
import { User, Lock, Shield, Palette, Eye, EyeOff } from 'lucide-react';
import { useState, useRef } from 'react';
import Layout from '@/layouts/Layout';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';

export default function Password() {
    const [activePage] = useState('password');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const navItems = [
        { id: 'profile', label: 'Profile', icon: User, href: '/settings/profile' },
        { id: 'password', label: 'Password', icon: Lock, href: '/settings/password' },
        { id: 'two-factor', label: 'Two-Factor Auth', icon: Shield, href: '/settings/two-factor' },
        { id: 'appearance', label: 'Appearance', icon: Palette, href: '/settings/appearance' },
    ];

    return (
        <Layout>
            <Head title="Password Settings" />

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
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Update Password
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Ensure your account is using a long, random password to stay secure
                                </p>
                            </div>

                            <Form
                                {...PasswordController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={['password', 'password_confirmation', 'current_password']}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }
                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-6"
                            >
                                {({ errors, processing, recentlySuccessful }) => (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    ref={currentPasswordInput}
                                                    type={showPasswords.current ? "text" : "password"}
                                                    name="current_password"
                                                    autoComplete="current-password"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                                    placeholder="Enter current password"
                                                    disabled={processing}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.current_password && (
                                                <p className="mt-1.5 text-sm text-red-600">{errors.current_password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    ref={passwordInput}
                                                    type={showPasswords.new ? "text" : "password"}
                                                    name="password"
                                                    autoComplete="new-password"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                                    placeholder="Enter new password"
                                                    disabled={processing}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                                    placeholder="Confirm new password"
                                                    disabled={processing}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password_confirmation && (
                                                <p className="mt-1.5 text-sm text-red-600">{errors.password_confirmation}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Updating...' : 'Update Password'}
                                            </button>
                                            {recentlySuccessful && (
                                                <span className="text-sm text-green-600 dark:text-green-400">
                                                    ✓ Password updated successfully
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
