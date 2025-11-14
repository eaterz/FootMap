import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { type SharedData } from '@/types';
import Layout from '@/layouts/Layout';
import AdminLayout from '@/layouts/AdminLayout';
import { disable, enable} from '@/routes/two-factor';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ShieldBan, ShieldCheck, Shield, User, Lock, Palette } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}


export default function TwoFactor({
                                      requiresConfirmation = false,
                                      twoFactorEnabled = false,
                                  }: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';
    const LayoutComponent = isAdmin ? AdminLayout : Layout;

    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    const navItems = [
        { id: 'profile', label: 'Profile', icon: User, href: '/settings/profile' },
        { id: 'password', label: 'Password', icon: Lock, href: '/settings/password' },
        { id: 'two-factor', label: 'Two-Factor Auth', icon: Shield, href: '/settings/two-factor' },
        { id: 'appearance', label: 'Appearance', icon: Palette, href: '/settings/appearance' },
    ];

    return (
        <LayoutComponent>
            <Head title="Two-Factor Authentication" />

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
                            const isActive = item.id === 'two-factor';
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
                            {/* Two-Factor Authentication Card */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white"> Two-Factor Authentication </h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"> Manage your two-factor authentication settings </p>
                                </div>

                                {twoFactorEnabled ? (
                                    <div className="flex flex-col items-start justify-start space-y-4">
                                        <Badge variant="default">Enabled</Badge>
                                        <p className="text-muted-foreground">
                                            With two-factor authentication enabled, you will be prompted for a secure, random pin during login, which you can retrieve from the TOTP-supported application on your phone.
                                        </p>
                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={errors}
                                        />
                                        <div className="relative inline">
                                            <Form {...disable.form()}>
                                                {({ processing }) => (
                                                    <Button
                                                        variant="destructive"
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        <ShieldBan /> Disable 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start justify-start space-y-4">
                                        <Badge variant="destructive">Disabled</Badge>
                                        <p className="text-muted-foreground">
                                            When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone.
                                        </p>
                                        <div>
                                            {hasSetupData ? (
                                                <Button onClick={() => setShowSetupModal(true)}>
                                                    <ShieldCheck /> Continue Setup
                                                </Button>
                                            ) : (
                                                <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                                    {({ processing }) => (
                                                        <Button type="submit" disabled={processing}>
                                                            <ShieldCheck /> Enable 2FA
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <TwoFactorSetupModal
                                    isOpen={showSetupModal}
                                    onClose={() => setShowSetupModal(false)}
                                    requiresConfirmation={requiresConfirmation}
                                    twoFactorEnabled={twoFactorEnabled}
                                    qrCodeSvg={qrCodeSvg}
                                    manualSetupKey={manualSetupKey}
                                    clearSetupData={clearSetupData}
                                    fetchSetupData={fetchSetupData}
                                    errors={errors}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    );
}
