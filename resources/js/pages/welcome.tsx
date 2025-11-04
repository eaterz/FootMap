import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Globe2, MapPin, Search, Trophy, Users } from 'lucide-react';

export default function Welcome({
                                    canRegister = true,
                                }: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Football Teams Database">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-1/7 w-1/7 items-center justify-center rounded-lg ">
                                    <img src="/footmap.png" alt="" />
                                </div>
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    FootMap
                                </span>
                            </div>
                            <nav className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-lg border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
                        <div className="text-center">
                            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
                                Discover Football Teams
                                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    From Around The World
                                </span>
                            </h1>
                            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Explore comprehensive information about football clubs, their stadiums, upcoming matches, and locations. Your ultimate football teams database.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-base font-medium text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
                                >
                                    <Search className="h-5 w-5" />
                                    {auth.user ? 'Browse Teams' : 'Get Started'}
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                                    >
                                        Learn More
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                            Everything You Need
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Comprehensive football team information at your fingertips
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                <Globe2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Global Coverage
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Access information about football teams from continents, countries, and leagues worldwide.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Interactive Maps
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Explore stadium locations on an interactive map and discover teams near you.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Team Details
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                View comprehensive team information including logos, stadiums, founding years, and more.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                <Search className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Advanced Search
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Filter and search teams by country, league, or name to find exactly what you're looking for.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 inline-flex rounded-lg bg-red-100 p-3 dark:bg-red-900">
                                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Upcoming Matches
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Stay updated with upcoming games and fixtures for your favorite teams.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900">
                                <Globe2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                League Structure
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Navigate through organized hierarchies from continents to leagues to teams.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-white">
                                Ready to explore?
                            </h2>
                            <p className="mb-8 text-lg text-green-50">
                                {auth.user
                                    ? 'Start browsing football teams from around the world'
                                    : 'Join us today and discover your favorite football teams'}
                            </p>
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-medium text-green-600 shadow-lg transition-all hover:bg-green-50 hover:shadow-xl"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Get Started Now'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            <p>
                                © 2024 Football Teams Database. Your ultimate source for football team information.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
