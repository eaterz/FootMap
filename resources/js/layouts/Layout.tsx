import { Link, usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { LogOut, Menu, X, User, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        }

        if (profileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [profileMenuOpen]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setProfileMenuOpen(false);
        router.post('/logout');
    };

    const handleSettings = (e: React.MouseEvent) => {
        e.preventDefault();
        setProfileMenuOpen(false);
        // Navigate to settings - update the href as needed
        router.visit('/settings/profile');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 transition-transform hover:scale-105"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
                                <img
                                    src="/footmap.png"
                                    alt="FootMap Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                FootMap
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:gap-6">
                            <Link
                                href="#"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                            >
                                Teams
                            </Link>
                            <Link
                                href="/stadiums"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                            >
                                Stadiums
                            </Link>
                            <Link
                                href="/leagues"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                            >
                                Leagues
                            </Link>
                            <Link
                                href="#"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                            >
                                Map
                            </Link>

                            {/* Profile Dropdown */}
                            <div className="relative border-l border-gray-300 pl-6 dark:border-gray-600" ref={profileRef}>
                                <button
                                    type="button"
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-sm font-semibold">
                                        {auth.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium">{auth.user?.name}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {auth.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {auth.user?.email}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <button
                                                type="button"
                                                onClick={handleSettings}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-200 py-1 dark:border-gray-700">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-200 md:hidden dark:border-gray-700">
                        <div className="space-y-1 px-4 py-3">
                            <Link
                                href="#"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Teams
                            </Link>
                            <Link
                                href="#"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Stadiums
                            </Link>
                            <Link
                                href="#"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Leagues
                            </Link>
                            <Link
                                href="#"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Map
                            </Link>

                            {/* Mobile User Section */}
                            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                                <div className="px-3 py-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-semibold">
                                            {auth.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {auth.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {auth.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSettings}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-800"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        <p>© 2024 FootMap. Your ultimate football teams database.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
