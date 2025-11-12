import { Head, Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { MapPin, Search, Trophy } from 'lucide-react';

export default function Dashboard() {
    // Team logos with consistent SVG URLs from Wikimedia
    const teamLogos = [
        { name: 'Manchester United', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
        { name: 'Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
        { name: 'Bayern Munich', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
        { name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
        { name: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
        { name: 'Juventus', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg' },
        { name: 'PSG', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
        { name: 'Chelsea', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
        { name: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
        { name: 'Inter Milan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png' },
    ];

    return (
        <Layout>
            <Head title="Dashboard" />

            {/* Hero Section with Scrolling Logos */}
            <div className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
                            Find Any Football Team
                        </h1>
                        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            Explore comprehensive information about football clubs from around the world
                        </p>
                        {/* Scrolling Logos Container */}
                        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white/50 py-8 backdrop-blur-sm dark:bg-gray-800/50">
                            <div className="flex flex-nowrap animate-scroll gap-8">
                                {/* Double the logos for seamless loop */}
                                {[...teamLogos, ...teamLogos].map((team, index) => (
                                    <div
                                        key={index}
                                        className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-white p-3 shadow-md dark:bg-gray-800"
                                    >
                                        <img
                                            src={team.logo}
                                            alt={team.name}
                                            className="h-full w-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = '⚽';
                                                e.currentTarget.parentElement!.classList.add('text-7xl');
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid - 4 Features */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search Teams Feature */}
                    <Link
                        href="/teams"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 p-8 shadow-lg transition-all hover:shadow-2xl dark:from-green-900 dark:to-emerald-900"
                    >
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-200/50 blur-3xl transition-transform group-hover:scale-150 dark:bg-green-800/50"></div>
                        <div className="relative">
                            <div className="mb-4 inline-flex rounded-lg bg-white/80 p-3 dark:bg-gray-800/80">
                                <Search className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Search Teams
                            </h3>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Find and explore football teams from around the world
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Search Now <span className="transition-transform group-hover:translate-x-1">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Leagues Feature */}
                    <Link
                        href="/leagues"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-8 shadow-lg transition-all hover:shadow-2xl dark:from-purple-900 dark:to-pink-900"
                    >
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-200/50 blur-3xl transition-transform group-hover:scale-150 dark:bg-purple-800/50"></div>
                        <div className="relative">
                            <div className="mb-4 inline-flex rounded-lg bg-white/80 p-3 dark:bg-gray-800/80">
                                <Trophy className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Leagues
                            </h3>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Browse teams from the world's top football leagues
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                                View Leagues <span className="transition-transform group-hover:translate-x-1">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Stadiums Feature */}
                    <Link
                        href="/stadiums"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 p-8 shadow-lg transition-all hover:shadow-2xl dark:from-orange-900 dark:to-amber-900"
                    >
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-orange-200/50 blur-3xl transition-transform group-hover:scale-150 dark:bg-orange-800/50"></div>
                        <div className="relative">
                            <div className="mb-4 inline-flex rounded-lg bg-white/80 p-3 dark:bg-gray-800/80">
                                <MapPin className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Stadiums
                            </h3>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Discover iconic stadiums and their home teams
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                                Explore Stadiums <span className="transition-transform group-hover:translate-x-1">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Interactive Map Feature */}
                    <Link
                        href="/map"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 p-8 shadow-lg transition-all hover:shadow-2xl dark:from-blue-900 dark:to-cyan-900"
                    >
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-200/50 blur-3xl transition-transform group-hover:scale-150 dark:bg-blue-800/50"></div>
                        <div className="relative">
                            <div className="mb-4 inline-flex rounded-lg bg-white/80 p-3 dark:bg-gray-800/80">
                                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Interactive Map
                            </h3>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Explore teams and stadiums on an interactive map
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                View Map <span className="transition-transform group-hover:translate-x-1">→</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </Layout>
    );
}
