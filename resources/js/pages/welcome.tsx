import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Globe2, MapPin, Search, Trophy, Users } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function Welcome({
                                    canRegister = true,
                                }: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const featureRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        featureRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

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
                                Explore comprehensive information about football clubs, their stadiums,
                                upcoming matches, and locations. Your ultimate football teams database.
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
                    <div className="mb-20 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                            Everything You Need
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Comprehensive football team information at your fingertips
                        </p>
                    </div>
                    <div className="space-y-32">
                        {/* Feature 1 - Image Left */}
                        <div
                            ref={(el) => {
                                if (el) featureRefs.current[0] = el;
                            }}
                            className="group flex flex-col items-center gap-12 lg:flex-row"
                        >
                            <div className="flex-1 feature-left opacity-0 -translate-x-[3rem]">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 p-12 shadow-xl dark:from-green-900 dark:to-emerald-900">
                                    <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-green-200/50 blur-3xl dark:bg-green-800/50"></div>
                                    <div className="relative flex items-center justify-center">
                                        <Globe2 className="h-48 w-48 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 feature-right opacity-0 translate-x-[3rem]">
                                <div className="inline-flex rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                    <Globe2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Global Coverage
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Access information about football teams from continents, countries, and
                                    leagues worldwide. Our comprehensive database covers teams from every corner
                                    of the globe, ensuring you never miss out on discovering new clubs.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 - Image Right */}
                        <div
                            ref={(el) => {
                                if (el) featureRefs.current[1] = el;
                            }}
                            className="group flex flex-col-reverse items-center gap-12 lg:flex-row"
                        >
                            <div className="flex-1 space-y-4 feature-left opacity-0 -translate-x-[3rem]">
                                <div className="inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Interactive Maps
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Explore stadium locations on an interactive map and discover teams near you.
                                    Visualize the geographical distribution of clubs and plan your stadium visits
                                    with ease.
                                </p>
                            </div>
                            <div className="flex-1 feature-right opacity-0 translate-x-[3rem]">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 p-12 shadow-xl dark:from-blue-900 dark:to-cyan-900">
                                    <div className="absolute left-0 top-0 h-64 w-64 -translate-x-16 -translate-y-16 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-800/50"></div>
                                    <div className="relative flex items-center justify-center">
                                        <MapPin className="h-48 w-48 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Image Left */}
                        <div
                            ref={(el) => {
                                if (el) featureRefs.current[2] = el;
                            }}
                            className="group flex flex-col items-center gap-12 lg:flex-row"
                        >
                            <div className="flex-1 feature-left opacity-0 -translate-x-[3rem]">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-12 shadow-xl dark:from-purple-900 dark:to-pink-900">
                                    <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-purple-200/50 blur-3xl dark:bg-purple-800/50"></div>
                                    <div className="relative flex items-center justify-center">
                                        <Trophy className="h-48 w-48 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 feature-right opacity-0 translate-x-[3rem]">
                                <div className="inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                    <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Team Details
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    View comprehensive team information including logos, stadiums, founding
                                    years, and more. Dive deep into each club's history and characteristics with
                                    our detailed profiles.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 - Image Right */}
                        <div
                            ref={(el) => {
                                if (el) featureRefs.current[3] = el;
                            }}
                            className="group flex flex-col-reverse items-center gap-12 lg:flex-row"
                        >
                            <div className="flex-1 space-y-4 feature-left opacity-0 -translate-x-[3rem]">
                                <div className="inline-flex rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                    <Search className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Advanced Search
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Filter and search teams by country, league, or name to find exactly what
                                    you're looking for. Our powerful search engine makes discovering teams quick
                                    and effortless.
                                </p>
                            </div>
                            <div className="flex-1 feature-right opacity-0 translate-x-[3rem]">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 p-12 shadow-xl dark:from-orange-900 dark:to-amber-900">
                                    <div className="absolute left-0 top-0 h-64 w-64 -translate-x-16 -translate-y-16 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-800/50"></div>
                                    <div className="relative flex items-center justify-center">
                                        <Search className="h-48 w-48 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 5 - Image Left */}
                        <div
                            ref={(el) => {
                                if (el) featureRefs.current[4] = el;
                            }}
                            className="group flex flex-col items-center gap-12 lg:flex-row"
                        >
                            <div className="flex-1 feature-left opacity-0 -translate-x-[3rem]">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 p-12 shadow-xl dark:from-red-900 dark:to-rose-900">
                                    <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-red-200/50 blur-3xl dark:bg-red-800/50"></div>
                                    <div className="relative flex items-center justify-center">
                                        <Users className="h-48 w-48 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 feature-right opacity-0 translate-x-[3rem]">
                                <div className="inline-flex rounded-lg bg-red-100 p-3 dark:bg-red-900">
                                    <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Upcoming Matches
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Stay updated with upcoming games and fixtures for your favorite teams. Never
                                    miss an important match with our comprehensive fixture database and schedule
                                    tracking.
                                </p>
                            </div>
                        </div>

                        {/* Feature 6 - Image Right */}
                        <div
                            ref={(el) => {
                                if (el) featureRefs.current[5] = el;
                            }}
                            className="group flex flex-col-reverse items-center gap-12 lg:flex-row"
                        >
                            <div className="flex-1 space-y-4 feature-left opacity-0 -translate-x-[3rem]">
                                <div className="inline-flex rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900">
                                    <Globe2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    League Structure
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Navigate through organized hierarchies from continents to leagues to teams.
                                    Our structured approach makes it easy to browse and understand football's
                                    global organization.
                                </p>
                            </div>
                            <div className="flex-1 feature-right opacity-0 translate-x-[3rem]">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-12 shadow-xl dark:from-emerald-900 dark:to-teal-900">
                                    <div className="absolute left-0 top-0 h-64 w-64 -translate-x-16 -translate-y-16 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-800/50"></div>
                                    <div className="relative flex items-center justify-center">
                                        <Trophy className="h-48 w-48 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-3rem);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(3rem);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-in .feature-left {
            animation: slideInLeft 0.8s ease-out forwards;
          }
          .animate-in .feature-right {
            animation: slideInRight 0.8s ease-out forwards;
          }
        `}</style>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-white">Ready to explore?</h2>
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
                            <p>© 2024 Football Teams Database. Your ultimate source for football team information.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
