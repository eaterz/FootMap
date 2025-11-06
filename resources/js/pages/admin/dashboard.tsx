import { Head } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { Users, Shield, Database, Activity } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <Layout>
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Teams
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    0
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
                                    0
                                </p>
                            </div>
                            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                                    0
                                </p>
                            </div>
                            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                                    0
                                </p>
                            </div>
                            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Quick Actions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <button className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                Add New Team
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Create a new football team
                            </p>
                        </button>

                        <button className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                Add Stadium
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Register a new stadium
                            </p>
                        </button>

                        <button className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
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
        </Layout>
    );
}
