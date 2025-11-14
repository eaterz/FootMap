import { Head, Link } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import {User, Lock, Shield, Palette } from 'lucide-react';
import { type SharedData } from '@/types';
import Layout from '@/layouts/Layout';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

const navItems = [
    { id: 'profile', label: 'Profile', icon: User, href: '/settings/profile' },
    { id: 'password', label: 'Password', icon: Lock, href: '/settings/password' },
    { id: 'two-factor', label: 'Two-Factor Auth', icon: Shield, href: '/settings/two-factor' },
    { id: 'appearance', label: 'Appearance', icon: Palette, href: '/settings/appearance' },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';
    const LayoutComponent = isAdmin ? AdminLayout : Layout;

    return (
        <LayoutComponent>
            <Head title="Appearance Settings" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white"> Settings </h1>
                            <p className="text-gray-600 dark:text-gray-400"> Manage your profile and account settings </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="mb-8 flex flex-wrap gap-2 justify-center">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.id === 'appearance';
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
                            {/* Appearance Settings Card */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white"> Appearance Settings </h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"> Update your account's appearance settings </p>
                                </div>
                                <AppearanceTabs />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    );
}
